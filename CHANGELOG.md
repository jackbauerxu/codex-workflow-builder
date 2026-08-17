# Changelog

## 0.6.0 - 2026-08-17

- 新增 Requirement Ledger，逐项回显需求，阻断 blocked/waived/implemented 无据交付，防止静默降级。
- 新增 existing-mp4-edit 第四路线与 probe-media / render-existing-mp4 / verify-delivery 工具三件套。
- 新增 Seedance 执行器 `tools/generate-asset.mjs`，读取 ARK_API_KEY，缺密钥时诚实降级。
- 将 2026-08-17 真实失败案例（五项需求只交付一帧静态图）纳入测试与 CI，运行时现场合成 fixtures。
- 测试脚本移除 `rg` 硬依赖，改用系统自带 `grep -qF`，提升可移植性。

## 0.5.0 - 2026-07-17

- 新增 `examples/remotion-starter/`：从 typed content 真实渲染 9:16 still frame 和 H.264 MP4。
- 新增二进制产物检查、Remotion 依赖锁定和 GitHub Actions 验证流程。
- 将主 `SKILL.md` 拆为精简入口，并把工作流和视频运行细节移入 `references/`。
- 新增 MIT License、贡献指南和可移植的 Skill metadata/repository contract 检查。
- 保留 Seedance 生成式资产状态、连续性账本、风格锁、事实来源、低置信度留空和人工审阅边界。

## 0.4.0

- 加入生产知识库、脚本模板、提示词库、风格预设、镜头库、参考资产和 Few-shot 示例。
- 融合 Seedance 风格生成式视频资产路线，并保留 `not_rendered` 不冒充成片的状态约束。
