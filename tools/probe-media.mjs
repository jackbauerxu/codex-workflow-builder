#!/usr/bin/env node
/**
 * probe-media.mjs
 *
 * 用途：探测一个视频文件的基础信息，并检测场景切换点。
 *
 * 用法：
 *   node tools/probe-media.mjs <video> [--scene-threshold 0.3] [--out probe.json]
 *
 * 参数：
 *   <video>                  必须，输入视频路径
 *   --scene-threshold <n>    默认 0.3，场景检测阈值
 *   --out <file>             可选，结果 JSON 写出路径；缺省时打印到 stdout
 *
 * 退出码：
 *   0 成功
 *   1 参数/输入/ffprobe/场景检测失败
 *   2 缺少 ffmpeg 或 ffprobe
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('用法: node tools/probe-media.mjs <video> [--scene-threshold 0.3] [--out probe.json]');
  process.exit(1);
}

const videoArg = args[0];
let sceneThreshold = 0.3;
let outFile = null;

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--scene-threshold') {
    const next = args[++i];
    if (next === undefined) {
      console.error('--scene-threshold 需要数值');
      process.exit(1);
    }
    sceneThreshold = Number(next);
  } else if (arg.startsWith('--scene-threshold=')) {
    sceneThreshold = Number(arg.slice('--scene-threshold='.length));
  } else if (arg === '--out') {
    const next = args[++i];
    if (next === undefined) {
      console.error('--out 需要文件路径');
      process.exit(1);
    }
    outFile = next;
  } else if (arg.startsWith('--out=')) {
    outFile = arg.slice('--out='.length);
  } else {
    console.error(`未知参数: ${arg}`);
    process.exit(1);
  }
}

if (!Number.isFinite(sceneThreshold) || sceneThreshold < 0) {
  console.error('scene_threshold 必须是 >= 0 的数字');
  process.exit(1);
}

const video = path.resolve(process.cwd(), videoArg);
if (!fs.existsSync(video)) {
  console.error(`输入文件不存在: ${video}`);
  process.exit(1);
}

const missing = [];
if (spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status !== 0) missing.push('ffmpeg');
if (spawnSync('ffprobe', ['-version'], { stdio: 'ignore' }).status !== 0) missing.push('ffprobe');
if (missing.length > 0) {
  console.error('缺少 ffmpeg/ffprobe，请先安装（macOS: brew install ffmpeg）');
  process.exit(2);
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

const probeRes = spawnSync(
  'ffprobe',
  ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', video],
  { encoding: 'utf8' }
);
if (probeRes.status !== 0) {
  console.error('ffprobe 失败：');
  console.error(probeRes.stderr || '');
  process.exit(1);
}

let probe;
try {
  probe = JSON.parse(probeRes.stdout);
} catch (err) {
  console.error('ffprobe 输出不是合法 JSON：' + err.message);
  process.exit(1);
}

const streams = Array.isArray(probe.streams) ? probe.streams : [];
const videoStream = streams.find((s) => s.codec_type === 'video');
if (!videoStream) {
  console.error('未找到视频流');
  process.exit(1);
}

const duration = parseFloat(probe.format?.duration || videoStream?.duration || '0') || 0;
const width = parseInt(videoStream.width || '0', 10) || 0;
const height = parseInt(videoStream.height || '0', 10) || 0;
const fps = parseRate(videoStream.r_frame_rate);
const audioStream = streams.find((s) => s.codec_type === 'audio');
const has_audio = Boolean(audioStream);
const audio_channels = has_audio ? parseInt(audioStream.channels || '0', 10) || 0 : 0;

const sceneFilter = `select='gt(scene,${sceneThreshold})',metadata=print:file=-`;
const sceneArgs = [
  '-v', 'error',
  '-i', video,
  '-vf', sceneFilter,
  '-an',
  '-f', 'null',
  '-'
];
const sceneRes = spawnSync('ffmpeg', sceneArgs, { encoding: 'utf8' });
if (sceneRes.status !== 0) {
  console.error('场景检测失败：');
  console.error(sceneRes.stderr || '');
  process.exit(1);
}

const raw = `${sceneRes.stdout || ''}\n${sceneRes.stderr || ''}`;
const sceneNumbers = [];
for (const match of raw.matchAll(/pts_time:([0-9]+(?:\.[0-9]+)?)/g)) {
  const n = Number(match[1]);
  if (Number.isFinite(n)) sceneNumbers.push(n);
}

const scene_cuts = [...new Set(sceneNumbers)].sort((a, b) => a - b);

const result = {
  file: video,
  duration,
  width,
  height,
  fps,
  has_audio,
  audio_channels,
  scene_threshold: sceneThreshold,
  scene_cuts,
  probed_at: new Date().toISOString()
};

function atomicWriteJson(filePath, object) {
  const dir = path.dirname(filePath);
  if (dir && dir !== '.') {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmp = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(object, null, 2) + '\n');
  fs.renameSync(tmp, filePath);
}

if (outFile) {
  const outPath = path.resolve(process.cwd(), outFile);
  atomicWriteJson(outPath, result);
  console.log(`[probe-media] 已写 ${outPath}`);
} else {
  console.log(JSON.stringify(result, null, 2));
}
