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
  fact_manifest: inputs/fact-manifest.json
  quality_gate: [style_lock, subtitle_safe_area, factual_accuracy, still_frame, preview, render]
```

实现时每个 scene 必须有确定的开始帧、时长、素材路径和字幕内容；随机性必须设种子或移除。渲染前先做 still frame 与预览审查，只有目标 MP4 实际写入 `outputs/final/` 后才称为完成。
