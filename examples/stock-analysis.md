# Few-shot：股票分析

**输入**：`根据我提供的季度报告与公告，做一条 45 秒的公司财报解释视频。`

**Production Configuration**

```yaml
lane: stock-analysis
style_preset: bloomberg
format: 1080x1920 / 30fps / 45s
as_of_date: supplied by the user
fact_sources: [quarterly report, earnings release]
verified_promise: "解释已披露数据中的一个业务变化与一个风险项"
```

**输出骨架**

1. `headline-card`：截至日期 + 一项已披露事件，不写“暴涨”“必买”等判断。
2. `source-card`：报告名称、页码/链接或公告日期。
3. `data-card`：一个业务指标，注明期间、单位、口径和来源。
4. `context-broll`：真实业务场景，或以中性行业图形解释背景；不能伪造公司现场画面。
5. `cta-card`：`这不是投资建议；继续核对原始披露。`

**通过条件**：所有数字和日期可回溯，事实与分析视觉分层，Bloomberg 预设只用来源卡/数据卡/橙色关键路径，不使用新闻 logo 或财经终端截图。缺资料时停止在 `insufficient_data`。
