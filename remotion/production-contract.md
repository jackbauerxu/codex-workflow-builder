# Remotion Production Contract

本目录不伪造一个没有依赖、素材和渲染验证的 Remotion 项目。它提供交给 `codex-remotion-daily-video` 或真实 Remotion 工程的最小合同。

```yaml
production:
  content_format: "project format or custom description"
  style_preset: minimal | apple | tesla | bloomberg | cyberpunk
  format: 1080x1920
  fps: 30
  duration_seconds: 15-60
  scripts: [scripts/opening.md, scripts/<project-template>.md, scripts/storytelling.md, scripts/outro.md, scripts/captions.md]
  shot_ids: []
  asset_manifest: inputs/asset-manifest.json
  generated_visuals:
    mode: none | generated | hybrid
    model: none | Seedance | Sora | Kling | Runway | Veo | other
    status: not_applicable | planned | not_rendered | generated | accepted | rejected
    source_identity: null
    continuity_ledger: null
    output_paths: []
  fact_manifest: inputs/fact-manifest.json
  quality_gate: [style_lock, subtitle_safe_area, factual_accuracy, still_frame, preview, render]
```

实现时每个 scene 必须有确定的开始帧、时长、素材路径和字幕内容；随机性必须设种子或移除。生成式素材必须记录来源身份、状态和真实文件路径；`planned`、`not_rendered` 或未通过 QA 的 `generated` 素材不能占据最终时间线，只有带真实路径的 `accepted` 素材可以。渲染前先做 still frame 与预览审查，只有目标 MP4 实际写入 `outputs/final/` 后才称为完成。
