# Reference Video Intake

仓库不打包第三方视频、平台截图或未授权素材。每次需要参考视频时，用户应提供可使用的本地路径或明确授权链接，并在当前项目的 `inputs/reference/` 创建：

```text
reference-manifest.json
- source_path_or_url
- rights_or_permission
- what_to_learn: rhythm | framing | information density | motion
- forbidden_to_copy: logo | exact edit | footage | music | voice
```

参考视频只用于分析节奏、镜头结构和信息密度。每个最终镜头仍需使用自有、授权或生成的素材；如果素材不足，标记 `missing_asset`，不得把参考视频裁进成片。
