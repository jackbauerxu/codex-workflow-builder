#!/usr/bin/env node
/**
 * verify-delivery.mjs
 *
 * 用途：逐项校验 edit-manifest 交付质量，并将 verification 写回账本。
 *
 * 用法：
 *   node tools/verify-delivery.mjs <edit-manifest.json>
 *
 * 退出码：
 *   0 全部校验通过
 *   1 有校验项未通过，或写回失败
 *   2 缺少 ffmpeg 或 ffprobe
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('用法: node tools/verify-delivery.mjs <edit-manifest.json>');
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
const results = [];

function addResult(check, pass, detail) {
  results.push({ check, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${check}: ${detail}`);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (err) {
  addResult('manifest_parse', false, `JSON 解析失败: ${err.message}`);
  console.log(`汇总: FAIL (0/${results.length})`);
  process.exit(1);
}

const manifestDir = path.dirname(manifestPath);
const reqsRaw = manifest.requirements;
const reqs = Array.isArray(reqsRaw) ? reqsRaw : [];

if (!Array.isArray(reqsRaw) || reqsRaw.length === 0) {
  addResult('requirements_nonempty', false, 'requirements 缺失或为空数组');
} else {
  addResult('requirements_nonempty', true, `${reqsRaw.length} 项需求`);
}

if (reqs.length > 0) {
  const statusesAllowed = new Set(['planned', 'blocked', 'waived', 'implemented']);
  const invalid = reqs
    .filter((r) => !statusesAllowed.has(r.status))
    .map((r, i) => r.id ?? `#${i}`)
    .join(', ');

  if (invalid) {
    addResult('requirements_status_allowed', false, `非法 status: ${invalid}`);
  } else {
    addResult('requirements_status_allowed', true, '所有 status 合法');
  }
} else {
  addResult('requirements_status_allowed', false, '无需求项可检查');
}

const planned = reqs.filter((r) => r.status === 'planned');
if (planned.length > 0) {
  const ids = planned.map((r, i) => r.id ?? `#${i}`).join(', ');
  addResult('no_planned', false, `存在悬空 planned 项: ${ids}`);
} else {
  addResult('no_planned', true, '无 planned 项');
}

const badBlocked = reqs.filter((r) => r.status === 'blocked' && (!r.evidence || String(r.evidence).trim() === ''));
if (badBlocked.length > 0) {
  const ids = badBlocked.map((r, i) => r.id ?? `#${i}`).join(', ');
  addResult('blocked_evidence', false, `blocked 项 evidence 为空: ${ids}`);
} else {
  addResult('blocked_evidence', true, 'blocked 项 evidence 均非空');
}

const badWaived = reqs.filter((r) => r.status === 'waived' && !String(r.evidence || '').includes('用户'));
if (badWaived.length > 0) {
  const ids = badWaived.map((r, i) => r.id ?? `#${i}`).join(', ');
  addResult('waived_evidence', false, `waived 项 evidence 未包含用户表态: ${ids}`);
} else {
  addResult('waived_evidence', true, 'waived 项 evidence 均可追溯到用户');
}

const badImplemented = reqs.filter((r) => r.status === 'implemented' && (!r.evidence || String(r.evidence).trim() === ''));
if (badImplemented.length > 0) {
  const ids = badImplemented.map((r, i) => r.id ?? `#${i}`).join(', ');
  addResult('implemented_evidence', false, `implemented 项 evidence 为空: ${ids}`);
} else {
  addResult('implemented_evidence', true, 'implemented 项 evidence 均非空');
}

const outRel = manifest.output_video;
const outPath = outRel ? path.resolve(manifestDir, String(outRel)) : null;
let outputHash = null;
let outputProbe = null;
let outputDuration = null;

if (!outPath) {
  addResult('output_video', false, 'output_video 未配置');
  addResult('output_ffprobe', false, 'output_video 未配置');
} else if (!fs.existsSync(outPath)) {
  addResult('output_video', false, `output_video 不存在: ${outPath}`);
  addResult('output_ffprobe', false, 'output_video 不存在');
} else {
  const outSize = fs.statSync(outPath).size;
  if (outSize <= 0) {
    addResult('output_video', false, `output_video 为空文件: ${outPath}`);
  } else {
    addResult('output_video', true, `存在且 ${outSize} 字节`);
    outputHash = hashFile(outPath);
  }

  outputProbe = probeMedia(outPath);
  if (!outputProbe.ok || !outputProbe.has_video || outputProbe.duration <= 0) {
    addResult('output_ffprobe', false, `ffprobe 无法解析视频时长: ${outputProbe?.error || '无视频流或时长为 0'}`);
  } else {
    outputDuration = outputProbe.duration;
    addResult('output_ffprobe', true, `时长 ${outputDuration}s`);
  }
}

const sourceRel = manifest.source_video;
let sourceHash = null;
let sourceProbe = null;

if (!sourceRel) {
  addResult('source_output_different', true, 'source_video 未配置，跳过原样交付检查');
} else {
  const srcPath = path.resolve(manifestDir, String(sourceRel));
  if (!fs.existsSync(srcPath)) {
    addResult('source_output_different', false, `source_video 不存在: ${srcPath}`);
  } else {
    sourceHash = hashFile(srcPath);
    sourceProbe = probeMedia(srcPath);
    if (outputHash && sourceHash) {
      if (sourceHash === outputHash) {
        addResult('source_output_different', false, 'source 与 output SHA-256 相同，原样交付');
      } else {
        addResult('source_output_different', true, 'source 与 output SHA-256 不同');
      }
    } else {
      addResult('source_output_different', false, '无法比较 SHA-256（源/输出文件不可读）');
    }
  }
}

const musicRequired = reqs.some(
  (r) => r.status === 'implemented' && /音乐|music/i.test(JSON.stringify(r))
);
if (musicRequired) {
  if (outputProbe?.has_audio) {
    addResult('music_requires_audio', true, '输出包含音频流');
  } else {
    addResult('music_requires_audio', false, '已实现需求包含音乐/music，但输出没有音频流');
  }
} else {
  addResult('music_requires_audio', true, '无音乐类已实现需求，跳过');
}

const dynamicEndCardRequired = reqs.some(
  (r) =>
    r.status === 'implemented' &&
    Array.isArray(r.assets) &&
    r.assets.some((asset) => /\.(mp4|mov)(\?|$)/i.test(String(asset)))
);
if (dynamicEndCardRequired) {
  if (sourceProbe?.duration && outputDuration > sourceProbe.duration) {
    addResult(
      'dynamic_asset_extends_duration',
      true,
      `output ${outputDuration}s > source ${sourceProbe.duration}s`
    );
  } else {
    addResult(
      'dynamic_asset_extends_duration',
      false,
      `动态片尾资产存在，但输出时长 ${outputDuration} 未大于源时长 ${sourceProbe?.duration}`
    );
  }
} else {
  addResult('dynamic_asset_extends_duration', true, '无动态片尾资产需求，跳过');
}

const overallPass = results.every((r) => r.pass);
const verification = {
  checked_at: new Date().toISOString(),
  results,
  pass: overallPass
};
manifest.verification = verification;

console.log(`汇总: ${overallPass ? 'PASS' : 'FAIL'} (${results.filter((r) => r.pass).length}/${results.length})`);

try {
  atomicWriteJson(manifestPath, manifest);
} catch (err) {
  console.error(`写回 verification 失败: ${err.message}`);
  process.exit(1);
}

process.exit(overallPass ? 0 : 1);

function probeMedia(file) {
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
      has_video: Boolean(v),
      has_audio: Boolean(a)
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
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
