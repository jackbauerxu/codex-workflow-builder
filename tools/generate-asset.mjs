#!/usr/bin/env node
/**
 * tools/generate-asset.mjs
 *
 * 用途：执行 Seedance 生成器，把定稿资产的 `not_rendered` 状态推进为 `generated`。
 * 用法：node tools/generate-asset.mjs <asset-record.json 路径>
 *
 * 环境变量：
 *   ARK_API_KEY          火山方舟 API Key，必填。
 *   ARK_BASE_URL         方舟 API 基地址，默认 https://ark.cn-beijing.volces.com/api/v3
 *   ARK_SEEDANCE_MODEL   模型 ID，默认 doubao-seedance-1-0-pro-250528
 *                        （模型 ID 会随版本更迭，以方舟控制台为准）
 *
 * 退出码：
 *   0 success: record 已回写 status=generated 并保存真实 output_path
 *   1 failure: 校验失败、API 失败/超时、下载失败、回写失败；record 保持不变
 *   2 未接通降级: 未配置 ARK_API_KEY；本次不渲染并保持 not_rendered
 */
import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const recordArg = process.argv[2];
if (!recordArg) {
  console.error('用法: node tools/generate-asset.mjs <asset-record.json 路径>');
  process.exit(1);
}

if (!process.env.ARK_API_KEY) {
  console.error('执行层未接通：未配置 ARK_API_KEY，本次降级为纯 prompt 输出，资产状态保持 not_rendered');
  process.exit(2);
}

const arkApiKey = process.env.ARK_API_KEY;
const arkBaseUrl = (process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3').replace(/\/+$/, '');
const seedanceModel = process.env.ARK_SEEDANCE_MODEL || 'doubao-seedance-1-0-pro-250528';

const recordPath = path.resolve(recordArg);
let record;
try {
  record = JSON.parse(await readFile(recordPath, 'utf8'));
} catch (err) {
  console.error(`读取 record 失败: ${err.message}`);
  process.exit(1);
}

if (record.status !== 'not_rendered') {
  console.error(`record.status 必须为 "not_rendered"，当前为 ${JSON.stringify(record.status)}`);
  process.exit(1);
}

const prompt = typeof record.prompt === 'string' ? record.prompt.trim() : '';
if (!prompt) {
  console.error('record.prompt 为空');
  process.exit(1);
}

if (typeof record.output_path !== 'string' || record.output_path.trim() === '') {
  console.error('record.output_path 为空');
  process.exit(1);
}

const textCommand = `${prompt} --ratio ${record.aspect_ratio ?? ''} --dur ${record.duration_seconds ?? ''}`;
console.log(`提交生成任务: model=${seedanceModel} output_path=${record.output_path}`);

let createResponse;
try {
  createResponse = await fetch(`${arkBaseUrl}/contents/generations/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${arkApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: seedanceModel,
      content: [{ type: 'text', text: textCommand }],
    }),
  });
} catch (err) {
  console.error(`创建任务网络请求失败: ${err.message}`);
  process.exit(1);
}

const createRaw = await createResponse.text();
let createBody;
try {
  createBody = JSON.parse(createRaw);
} catch {
  createBody = null;
}

if (!createResponse.ok) {
  console.error(`创建任务失败 HTTP ${createResponse.status}`);
  console.error(createRaw || '(空的错误响应体)');
  process.exit(1);
}

if (createBody?.error) {
  console.error('创建任务 API 返回错误:');
  console.error(JSON.stringify(createBody.error, null, 2));
  process.exit(1);
}

const taskId = createBody?.id ?? createBody?.data?.id;
if (!taskId) {
  console.error('创建任务响应缺少 task id');
  console.error(createRaw || '(空响应体)');
  process.exit(1);
}
console.log(`任务已创建: ${taskId}`);

const deadline = Date.now() + 15 * 60 * 1000;
let lastStatus = '';
let resultBody = null;

while (Date.now() < deadline) {
  let pollResponse;
  try {
    pollResponse = await fetch(`${arkBaseUrl}/contents/generations/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${arkApiKey}` },
    });
  } catch (err) {
    console.error(`轮询任务网络请求失败: ${err.message}`);
    process.exit(1);
  }

  const pollRaw = await pollResponse.text();
  let pollBody;
  try {
    pollBody = JSON.parse(pollRaw);
  } catch {
    console.error(`轮询响应不是 JSON: ${pollRaw}`);
    process.exit(1);
  }

  if (!pollResponse.ok) {
    console.error(`轮询任务失败 HTTP ${pollResponse.status}`);
    console.error(pollRaw || '(空的错误响应体)');
    process.exit(1);
  }

  const status = pollBody?.status ?? pollBody?.data?.status ?? '';
  if (status && status !== lastStatus) {
    console.log(`任务状态: ${status}`);
    lastStatus = status;
  }

  if (status === 'succeeded') {
    resultBody = pollBody;
    break;
  }

  if (['failed', 'cancelled', 'canceled', 'expired'].includes(status)) {
    console.error(`任务失败，状态: ${status}`);
    console.error(pollRaw || '(空的错误响应体)');
    process.exit(1);
  }

  await sleep(5000);
}

if (!resultBody) {
  console.error('任务轮询超时（15 分钟）');
  process.exit(1);
}

function extractVideoUrl(body) {
  const candidates = [
    body?.content?.video_url,
    body?.data?.content?.video_url,
    body?.data?.content?.[0]?.video_url,
    body?.content?.[0]?.video_url,
  ];
  return candidates.find((url) => typeof url === 'string' && url.length > 0) ?? null;
}

const videoUrl = extractVideoUrl(resultBody);
if (!videoUrl) {
  console.error('任务成功但未返回 video_url');
  console.error(JSON.stringify(resultBody, null, 2));
  process.exit(1);
}

const recordDir = path.dirname(recordPath);
const outputPath = path.isAbsolute(record.output_path)
  ? path.resolve(record.output_path)
  : path.resolve(recordDir, record.output_path);

await mkdir(path.dirname(outputPath), { recursive: true });

console.log(`开始下载视频: ${videoUrl}`);
let downloadResponse;
try {
  downloadResponse = await fetch(videoUrl);
} catch (err) {
  console.error(`下载视频网络请求失败: ${err.message}`);
  process.exit(1);
}

if (!downloadResponse.ok) {
  const downloadRaw = await downloadResponse.text();
  console.error(`下载视频失败 HTTP ${downloadResponse.status}`);
  console.error(downloadRaw || '(空的错误响应体)');
  process.exit(1);
}

const videoBuffer = Buffer.from(await downloadResponse.arrayBuffer());
if (!videoBuffer.length) {
  console.error('下载完成但文件为 0 字节');
  process.exit(1);
}

await writeFile(outputPath, videoBuffer);

const fileStat = await stat(outputPath);
if (!fileStat.isFile() || fileStat.size <= 0) {
  console.error('下载文件校验失败：文件不存在或为 0 字节');
  process.exit(1);
}

console.log(`下载完成: ${outputPath} (${fileStat.size} bytes)`);

const updatedRecord = {
  ...record,
  status: 'generated',
  generated_at: new Date().toISOString(),
  ark_task_id: taskId,
  output_path: outputPath,
};

const tempRecordPath = `${recordPath}.tmp`;
await writeFile(tempRecordPath, `${JSON.stringify(updatedRecord, null, 2)}\n`);
await rename(tempRecordPath, recordPath);

console.log(`已回写 record: status=generated output_path=${outputPath} ark_task_id=${taskId}`);
process.exit(0);
