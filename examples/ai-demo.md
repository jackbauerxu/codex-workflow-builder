# Few-shot：AI 功能演示

**输入**：`为团队知识库的“会议纪要转任务”功能做 30 秒短视频，受众为小团队管理者。`

**Production Configuration**

```yaml
  content_format: "AI demo"
style_preset: minimal
format: 1080x1920 / 30fps / 30s
verified_promise: "把会议纪要中的待办整理成可确认任务"
```

**输出骨架**

1. `hook-problem`：`会议结束，任务却散在聊天里。`
2. `screen-proof`：录屏拖入纪要，展示待办被识别；不声称准确率。
3. `process-path`：确认负责人、截止时间、优先级三步。
4. `result-state`：任务列表进入待确认状态。
5. `cta-card`：`拿一份纪要试一次。`

**通过条件**：标题、真实录屏、字幕安全区和 Minimal 预设保持一致；首个预览只是候选，文字或光标不清晰就只修该维度。
