# Few-shot：新闻速览

**输入**：`把一条已确认的 AI 融资新闻做成 45 秒解释视频。`

**Production Configuration**

```yaml
  content_format: "news explainer"
style_preset: bloomberg
format: 1080x1920 / 30fps / 45s
fact_sources: [company announcement, filing or named primary report]
```

**输出骨架**

1. `headline-card`：事件、日期、来源。
2. `source-card`：原始公告或报道的可验证摘要。
3. `data-card`：仅展示来源确认的金额、日期或单位。
4. `context-broll`：解释相关行业，而非伪造现场画面。
5. `cta-card`：`下一条看它会先影响哪个环节。`

**通过条件**：所有事实有来源，推测单独标注；橙色只服务关键数据，不能借用新闻机构的 logo 或截图。
