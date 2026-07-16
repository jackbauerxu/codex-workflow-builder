# TikTok / Shorts 提示词

适用于快节奏观点、技巧、复盘或挑战类内容。

```text
目标：把 {topic} 讲成 {duration_seconds} 秒、{platform} 的竖屏短视频。
受众：{audience}。
唯一承诺：{verified_promise}。
选择风格预设：{style_preset}；不得混入其它未选预设的字体、配色或转场。
按 opening → storytelling → outro 生成分镜。前 3 秒交代冲突；中段只给 2-3 个动作；结尾只给一个 CTA。
每段返回 narration、on_screen_text、shot_id、duration_seconds、fact_source；没有来源的数字标为 unsupported，不可使用。
```

默认节奏为 1.0-2.5 秒一镜；没有合适 B-roll 时标记 `missing_asset`，不得用无关画面硬填。
