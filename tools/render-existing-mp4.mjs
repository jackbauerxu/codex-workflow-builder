#!/usr/bin/env node
/**
 * render-existing-mp4.mjs
 *
 * 用途：根据 edit-manifest 中的 edit_plan 渲染“已有 MP4 编辑”产物。
 *
 * 用法：
 *   node tools/render-existing-mp4.mjs <edit-manifest.json>
 *
 * 退出码：
 *   0 渲染成功，且 executed 已写回账本
 *   1 资产硬闸不过/ffmpeg 失败/输出无效/写回失败
 *   2 缺少 ffmpeg 或 ffprobe
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('用法: node tools/render-existing-mp4.mjs <edit-manifest.json>');
  process.exit(1);
}

const missing = [];
if (spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status !== 0) missing.push('ffmpeg');
if (spawnSync('ffprobe', ['-version'], { stdio: 'ignore' }).status !== 0) missing.push('ffprobe');
if (missing.length > 0) {
  console.error('缺少 ffmpeg/ffprobe，请先安装（macOS: brew install ffmpeg）');
  process.exit(2);
}

const manifestPath = path.resolve(process.cwd(), args[0]);
if (!fs.existsSync(manifestPath)) {
  console.error(`账本不存在: ${manifestPath}`);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (err) {
  console.error(`账本 JSON 解析失败: ${err.message}`);
  process.exit(1);
}

const plan = manifest.edit_plan;
if (!plan || typeof plan !== 'object') {
  console.error('edit_plan 缺失或不是对象');
  process.exit(1);
}

const manifestDir = path.dirname(manifestPath);
const sourceRel = plan.source || manifest.source_video || '';
const outputRel = plan.output || manifest.output_video || '';

let sourcePath = null;
let outputPath = null;
if (sourceRel) sourcePath = path.resolve(manifestDir, sourceRel);
if (outputRel) outputPath = path.resolve(manifestDir, outputRel);

const preflightErrors = [];
let sourceProbe = null;
let endProbe = null;
let endVideoPath = null;
let musicPath = null;

if (!sourceRel) {
  preflightErrors.push('edit_plan.source / manifest.source_video 缺失');
} else if (!fs.existsSync(sourcePath)) {
  preflightErrors.push(`source 不存在: ${sourcePath}`);
} else {
  sourceProbe = probeFile(sourcePath);
  if (!sourceProbe.ok) {
    preflightErrors.push(`source 无法 ffprobe: ${sourceProbe.error}`);
  } else if (!sourceProbe.has_video) {
    preflightErrors.push('source 没有视频流');
  } else if (!sourceProbe.width || !sourceProbe.height) {
    preflightErrors.push('source 缺少宽度或高度');
  } else if (sourceProbe.duration <= 0) {
    preflightErrors.push('source 时长为 0');
  }
}

if (!outputRel) {
  preflightErrors.push('edit_plan.output / manifest.output_video 缺失');
} else {
  const outDir = path.dirname(outputPath);
  try {
    fs.mkdirSync(outDir, { recursive: true });
  } catch (err) {
    preflightErrors.push(`输出目录不可建: ${outDir}: ${err.message}`);
  }
}

if (plan.transitions?.enabled !== false && Array.isArray(plan.transitions?.cut_points) && plan.transitions.cut_points.length > 0) {
  if (Number(plan.transitions.duration || 0.5) <= 0) {
    preflightErrors.push('transitions.duration 必须 > 0');
  }
}

if (plan.music?.file) {
  musicPath = path.resolve(manifestDir, plan.music.file);
  if (!fs.existsSync(musicPath)) {
    preflightErrors.push(`music.file 不存在: ${musicPath}`);
  }
}

if (plan.end_card?.video) {
  endVideoPath = path.resolve(manifestDir, plan.end_card.video);
  if (!fs.existsSync(endVideoPath)) {
    preflightErrors.push(`end_card.video 不存在: ${endVideoPath}`);
  } else {
    endProbe = probeFile(endVideoPath);
    if (!endProbe.ok) {
      preflightErrors.push(`end_card.video 无法 ffprobe: ${endProbe.error}`);
    } else {
      if (!endProbe.has_video) {
        preflightErrors.push('end_card.video 没有视频流');
      }
      if (endProbe.duration <= 0.5) {
        preflightErrors.push(`end_card.video 时长 ${endProbe.duration} <= 0.5 秒`);
      }
      if (endProbe.nb_frames !== null && endProbe.nb_frames !== undefined && Number(endProbe.nb_frames) === 1) {
        preflightErrors.push('end_card.video nb_frames=1，疑似静态图；本仓库红线：不得用静态图顶替动态片尾');
      }
    }
  }
}

if (plan.end_card?.text) {
  const fontRel = plan.end_card.font_file;
  if (!fontRel) {
    preflightErrors.push('end_card.text 已配置，但缺少 font_file');
  } else {
    const fontPath = path.resolve(manifestDir, fontRel);
    if (!fs.existsSync(fontPath)) {
      preflightErrors.push(`font_file 不存在: ${fontPath}`);
    }
  }
}

if (preflightErrors.length > 0) {
  console.error('渲染前资产硬闸未通过：');
  for (const err of preflightErrors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

const sourceDuration = sourceProbe.duration;
const sourceWidth = sourceProbe.width;
const sourceHeight = sourceProbe.height;
const sourceFps = sourceProbe.fps || 25;
const sourceHasAudio = sourceProbe.has_audio;

const transCfg = plan.transitions || {};
const transEnabled = transCfg.enabled !== false;
const transDuration = Number(transCfg.duration || 0.5);

let cuts = [];
if (Array.isArray(transCfg.cut_points)) {
  const rawCuts = transCfg.cut_points.map(Number).filter(Number.isFinite);
  const sorted = [...new Set(rawCuts)].sort((a, b) => a - b);
  cuts = sorted.filter((c) => c >= 2 * transDuration && sourceDuration - c >= 2 * transDuration);
}

const useTransitions = transEnabled && cuts.length > 0;
const mainVideoDuration = useTransitions ? sourceDuration - cuts.length * transDuration : sourceDuration;

const musicInputIndex = 1 + (endVideoPath ? 1 : 0);

const filters = [];
const boundaries = useTransitions ? [0, ...cuts, sourceDuration] : [0, sourceDuration];
const segmentsCount = boundaries.length - 1;

let videoLabel;
if (useTransitions) {
  const segDurations = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i];
    const end = boundaries[i + 1];
    if (end - start <= 0.000001) continue;
    filters.push(`[0:v]trim=start=${fmt(start)}:end=${fmt(end)},setpts=PTS-STARTPTS[sgv${i}]`);
    segDurations.push(end - start);
  }

  videoLabel = 'sgv0';
  for (let i = 1; i < segmentsCount; i++) {
    const prefixDuration = segDurations.slice(0, i).reduce((a, b) => a + b, 0);
    const offset = prefixDuration - i * transDuration;
    filters.push(`[${videoLabel}][sgv${i}]xfade=transition=fade:duration=${fmt(transDuration)}:offset=${fmt(offset)}[xvf${i}]`);
    videoLabel = `xvf${i}`;
  }
} else {
  filters.push(`[0:v]null[vsrc0]`);
  videoLabel = 'vsrc0';
}

if (plan.color?.preset === 'warm') {
  filters.push(`[${videoLabel}]eq=gamma=1.02:saturation=1.06,colorbalance=rm=0.04:bm=-0.03[vcol]`);
  videoLabel = 'vcol';
}

let audioLabel = null;
if (sourceHasAudio) {
  if (useTransitions) {
    for (let i = 0; i < boundaries.length - 1; i++) {
      const start = boundaries[i];
      const end = boundaries[i + 1];
      filters.push(`[0:a]atrim=start=${fmt(start)}:end=${fmt(end)},asetpts=PTS-STARTPTS[sga${i}]`);
    }
    audioLabel = 'sga0';
    for (let i = 1; i < segmentsCount; i++) {
      filters.push(`[${audioLabel}][sga${i}]acrossfade=d=${fmt(transDuration)}[acr${i}]`);
      audioLabel = `acr${i}`;
    }
    filters.push(`[${audioLabel}]aformat=sample_rates=48000:channel_layouts=stereo[amain]`);
    audioLabel = 'amain';
  } else {
    filters.push(`[0:a]aformat=sample_rates=48000:channel_layouts=stereo[amain]`);
    audioLabel = 'amain';
  }
}

let endDuration = 0;
if (endProbe) {
  endDuration = endProbe.duration || 0;

  filters.push(`[1:v]scale=${sourceWidth}:${sourceHeight}:force_original_aspect_ratio=decrease,pad=${sourceWidth}:${sourceHeight}:(ow-iw)/2:(oh-ih)/2,fps=${fmt(sourceFps)},setsar=1[endv0]`);
  let endVideoLabel = 'endv0';

  const endText = plan.end_card?.text;
  if (endText) {
    const fontPath = path.resolve(manifestDir, plan.end_card.font_file);
    const fade = Number(plan.end_card.text_fade_in || 0.5);
    const alphaExpr = Number.isFinite(fade) && fade > 0
      ? `'if(lt(t,${fmt(fade)}),t/${fmt(fade)},1)'`
      : `'1'`;
    filters.push(`[endv0]drawtext=fontfile=${qf(fontPath)}:text=${qf(endText)}:fontcolor=white:borderw=2:bordercolor=black:x=(w-text_w)/2:y=h*0.72:alpha=${alphaExpr}:enable='gte(t,0)'[endv]`);
    endVideoLabel = 'endv';
  }

  filters.push(`[${videoLabel}][${endVideoLabel}]concat=n=2:v=1:a=0[vout]`);
  videoLabel = 'vout';

  if (endProbe.has_audio) {
    filters.push(`[1:a]aformat=sample_rates=48000:channel_layouts=stereo[aend]`);
  } else {
    filters.push(`anullsrc=channel_layout=stereo:sample_rate=48000,atrim=duration=${fmt(endDuration)},aformat=sample_rates=48000:channel_layouts=stereo[aend]`);
  }

  if (audioLabel) {
    filters.push(`[${audioLabel}][aend]concat=n=2:v=0:a=1[amain_end]`);
    audioLabel = 'amain_end';
  } else {
    filters.push(`anullsrc=channel_layout=stereo:sample_rate=48000,atrim=duration=${fmt(mainVideoDuration)},aformat=sample_rates=48000:channel_layouts=stereo[amain_sil]`);
    filters.push(`[amain_sil][aend]concat=n=2:v=0:a=1[amain_end]`);
    audioLabel = 'amain_end';
  }
}

if (musicPath) {
  const music = plan.music || {};
  const duckDb = music.duck_db ?? -15;
  const fadeIn = Number(music.fade_in ?? 0);
  const fadeOut = Number(music.fade_out ?? 0);
  const totalVideoDuration = mainVideoDuration + (endProbe ? endDuration : 0);

  let chain = `[${musicInputIndex}:a]aformat=sample_rates=48000:channel_layouts=stereo`;
  if (duckDb !== undefined) chain += `,volume=${duckDb}dB`;
  if (Number.isFinite(fadeIn) && fadeIn > 0) chain += `,afade=t=in:st=0:d=${fmt(fadeIn)}`;
  if (Number.isFinite(fadeOut) && fadeOut > 0) {
    const fadeOutStart = Math.max(0, totalVideoDuration - fadeOut);
    chain += `,afade=t=out:st=${fmt(fadeOutStart)}:d=${fmt(fadeOut)}`;
  }
  chain += `[music0]`;
  filters.push(chain);

  if (audioLabel) {
    filters.push(`[${audioLabel}]asplit=2[amain_sc][amain_mix]`);
    filters.push(`[music0][amain_sc]sidechaincompress=threshold=0.03:ratio=4[music_duck]`);
    filters.push(`[amain_mix][music_duck]amix=inputs=2:duration=first:dropout_transition=0[aout]`);
    audioLabel = 'aout';
  } else {
    filters.push(`[music0]atrim=duration=${fmt(totalVideoDuration)},asetpts=PTS-STARTPTS[aout]`);
    audioLabel = 'aout';
  }
}

const filterGraph = filters.join(';');
const maps = ['-map', `[${videoLabel}]`];
if (audioLabel) maps.push('-map', `[${audioLabel}]`);

const encoding = [
  '-c:v', 'libx264',
  '-crf', '18',
  '-preset', 'medium',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-movflags', '+faststart'
];

const ffmpegArgs = [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-i', sourcePath
];
if (endVideoPath) ffmpegArgs.push('-i', endVideoPath);
if (musicPath) ffmpegArgs.push('-i', musicPath);
ffmpegArgs.push('-filter_complex', filterGraph, ...maps, ...encoding, outputPath);

console.log('[render-existing-mp4] 开始渲染');
console.log(`ffmpeg ${ffmpegArgs.map(shellQuote).join(' ')}`);

const renderRes = spawnSync('ffmpeg', ffmpegArgs, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 1024 });
if (renderRes.status !== 0) {
  console.error(`[render-existing-mp4] ffmpeg 失败，退出码 ${renderRes.status}`);
  if (renderRes.stderr) console.error(renderRes.stderr);
  process.exit(1);
}

if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
  console.error('输出文件不存在或为 0 字节');
  process.exit(1);
}

const sourceHash = hashFile(sourcePath);
const outputHash = hashFile(outputPath);
if (sourceHash === outputHash) {
  console.error('输出与源文件 SHA-256 相同，渲染未产生变化');
  process.exit(1);
}

const outputBytes = fs.statSync(outputPath).size;
plan.executed = {
  finished_at: new Date().toISOString(),
  output_bytes: outputBytes,
  ffmpeg_args: ffmpegArgs
};

try {
  atomicWriteJson(manifestPath, manifest);
} catch (err) {
  console.error(`写回账本失败: ${err.message}`);
  process.exit(1);
}

console.log(`[render-existing-mp4] 渲染完成，输出 ${outputBytes} 字节`);

function probeFile(file) {
  const res = spawnSync(
    'ffprobe',
    ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file],
    { encoding: 'utf8' }
  );
  if (res.status !== 0) {
    return { ok: false, error: (res.stderr || '').trim() };
  }
  try {
    const data = JSON.parse(res.stdout);
    const streams = Array.isArray(data.streams) ? data.streams : [];
    const v = streams.find((s) => s.codec_type === 'video');
    const a = streams.find((s) => s.codec_type === 'audio');
    const duration = parseFloat(data.format?.duration || v?.duration || a?.duration || '0') || 0;
    return {
      ok: true,
      duration,
      width: parseInt(v?.width || '0', 10) || 0,
      height: parseInt(v?.height || '0', 10) || 0,
      fps: parseRate(v?.r_frame_rate),
      has_video: Boolean(v),
      has_audio: Boolean(a),
      nb_frames: v?.nb_frames ?? null
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function parseRate(rate) {
  if (!rate) return 25;
  const [num, den] = String(rate).split('/');
  if (den && Number(den) !== 0) {
    const value = Number(num) / Number(den);
    return Number.isFinite(value) && value > 0 ? value : 25;
  }
  const value = Number(rate);
  return Number.isFinite(value) && value > 0 ? value : 25;
}

function fmt(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  return parseFloat(num.toFixed(6)).toString();
}

function qf(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function shellQuote(arg) {
  const str = String(arg);
  if (/^[a-zA-Z0-9_\-./:=]+$/.test(str)) return str;
  return `'${str.replace(/'/g, "'\\''")}'`;
}

function hashFile(file) {
  const hash = crypto.createHash('sha256');
  const fd = fs.openSync(file, 'r');
  const buffer = Buffer.alloc(64 * 1024);
  let n;
  while ((n = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) {
    hash.update(buffer.subarray(0, n));
  }
  fs.closeSync(fd);
  return hash.digest('hex');
}

function atomicWriteJson(file, object) {
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(object, null, 2) + '\n');
  fs.renameSync(tmp, file);
}
