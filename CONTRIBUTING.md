# Contributing

感谢参与 `codex-workflow-builder`。这个仓库同时维护可调用的 Skill、生产知识库和一个真实可运行的 Remotion starter；提交内容需要让三者保持一致。

## 修改流程

1. 先说明新增或变化的触发场景、输入、输出和质量门。
2. 可组合内容放入 `scripts/`、`prompts/`、`styles/`、`references/` 或 `examples/`，不要把题材限制硬编码成封闭 taxonomy。
3. 修改视频生产规则时，保留单一 `style_preset`、事实来源、素材权利、`missing_asset` 和 generated-asset 状态边界。
4. 修改 Remotion starter 时，在 `examples/remotion-starter/` 执行完整验证。
5. 更新 `test-prompts.json` 的正向、负向或边界场景，并保持文档与实际路径同步。

## 本地验证

```bash
node tests/repository-contract/check-skill-metadata.mjs
bash tests/repository-contract/check-repository.sh
bash tests/production-skill-contract/focused-check.sh
jq empty test-prompts.json
cd examples/remotion-starter
npm ci
npm run typecheck
npm run render:still
npm run render:smoke
npm run verify:artifacts
```

不要提交 `node_modules/`、密钥、未授权的第三方素材或把 preview/composition 当成最终视频的描述。渲染产物可作为小型可查看证据提交；大型或临时产物应留在 CI artifact。
