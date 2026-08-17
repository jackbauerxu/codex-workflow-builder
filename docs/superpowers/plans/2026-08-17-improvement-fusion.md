# 2026-08-17 全面完善融合方案（Claude 执笔，待 Codex 确认）

背景：真实失败案例——用户给粗剪 mp4 提五项需求（切点转场/感人润色/情绪音乐/数字人奔跑片尾+思源黑体/成品导出），skill 只交付了一帧静态图+文字，其余静默消失。双方案独立产出后融合如下。

## 批次范围（按执行顺序）

### B1｜需求账本 + 禁止静默降级（P0）
- 新增单个机器可读账本 `templates/edit-manifest.template.json`：需求数组，每项含 `id/requirement/status(planned|implemented|blocked|waived)/evidence/timecodes/assets`。
- SKILL.md 增补：接到多项需求先落账本回显；交付报告逐项对照；任一项非 `implemented` 且未获用户 `waived`，禁止宣称完成。
- 采纳来源：状态机与机器可读账本来自 Codex；"清单先行+逐项验收"来自 Claude。
- 放弃点：Codex 提议的三份独立 JSON Schema（requirements/edit-manifest/delivery-report）收敛为**一份** manifest 模板，由 B2 的 verify 工具校验——三份 schema 无独立消费方，属过度建模（Claude 理由，融合裁定）。

### B2｜"已有 MP4 编辑"路由 + 可执行工具链（P0）
- 新增 `references/existing-mp4-edit.md`：第四条路线——素材探测→切点→转场→调色→混音→片尾合成→验收；明确阻塞条件（无音乐文件/无动态片尾资产/字体缺失→blocked，不得用静态图顶替动态资产）。
- 新增 `tools/probe-media.mjs`（ffprobe 探测+ffmpeg scdet 切点检测）、`tools/render-existing-mp4.mjs`（读 manifest 驱动 ffmpeg：xfade 转场/音乐淡入淡出+人声 ducking/片尾拼接/drawtext 字体路径必填）、`tools/verify-delivery.mjs`（校验 manifest 完整性+输出非空非原片+规格符合+逐项回写 evidence）。
- 路由接线：SKILL.md 路线表、`agents/openai.yaml`、README 同步补该路由，保证"给我一段视频润色"必命中此路线而不是落入 Remotion 示例。
- 采纳来源：路由缺失诊断与工具三件套划分来自 Codex；ffmpeg 具体手法（scdet/xfade/ducking/drawtext）来自 Claude；**工具用 Node(.mjs) 不用 Python**——与仓库现有 Node 生态一致（Codex 理由，Claude 让步，放弃 PySceneDetect 改用 ffmpeg 原生 scdet，少一个运行时依赖）。
- 边界（双方一致）："感人"等审美不承诺自动判定，调色只做预设级；预览确认留人工。

### B3｜真实失败案例进测试与 CI（P1）
- 新增 `tests/existing-mp4-edit/`：check 脚本用 ffmpeg 现场合成小样视频（不入库二进制），覆盖四个用例——五项需求账本齐全、缺音乐必须 blocked、片尾静态图必须 fail、输出与原片相同必须 fail。
- `test-prompts.json` 与 `tests/production-skill-contract/` 增补路由/账本断言；`.github/workflows/verify.yml` 挂新测试。
- 采纳来源：整条来自 Codex；"fixture 用 ffmpeg 现场合成不提交二进制"来自 Claude。

### B4｜Seedance 生成执行器（P2）
- 新增 `tools/generate-asset.mjs`：读七段式 prompt 与资产记录 → 调火山方舟 Seedance API（key 走 `ARK_API_KEY` 环境变量）→ 轮询 → 下载 mp4 → 回写 `output_path` 与 `status: generated`。未配 key 时明确输出"执行层未接通，降级为纯 prompt"，不静默。
- `prompts/generative-video.md` 与 `references/generative-video-production.md` 增补执行器指引一段。
- 采纳来源：整条来自 Claude（Codex 方案未覆盖此断点；此断点是本次失败案例中数字人需求无法落地的直接原因）。

### B5｜可移植性与文档收尾（P2）
- 两份 shell 检查移除未声明的 `rg` 硬依赖（改 grep 或声明依赖并前置检测）。
- `CONTRIBUTING.md`、`CHANGELOG.md`、README 同步本批变更。
- 采纳来源：整条来自 Codex（实测确认 `check-repository.sh:7` rg 依赖属实）。

## 本批明确不做（进 backlog）
- **pyJianYingDraft 剪映草稿写入**（Claude 原 P3）：草稿格式随剪映版本漂移、依赖重，收益/风险比不过关，Codex 方案亦未采纳——挂起，待路由与工具链稳定后再评估。
- 情绪/审美自动化、通用 NLE 自研：双方一致列为永久边界。
- 音乐自动选曲：选曲是人工判断点，工具只做混音。

## 验收总门
- `bash tests/production-skill-contract/focused-check.sh`、`bash tests/repository-contract/check-repository.sh`、新增 `tests/existing-mp4-edit/check.sh` 全绿；
- 端到端冒烟：ffmpeg 合成 20 秒样片 + 一段 4 秒"片尾资产"+ 一首合成音轨，按五项需求跑全链路，交付报告五项全部有状态与证据。
