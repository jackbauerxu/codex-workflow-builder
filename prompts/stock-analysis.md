# 股票分析提示词

```text
把 {ticker_or_company} 的已提供资料做成 {duration_seconds} 秒竖屏分析视频。
只使用 {fact_sources} 中日期明确、可追溯的数字；说明截止日期与不是投资建议。
选择 {style_preset}（默认 bloomberg），按 数据钩子 → 业务/财务事实 → 一个风险或不确定项 → 资料来源 的结构输出。
每段返回 narration、on_screen_text、shot_id、图表数据/单位、fact_source、duration_seconds。
不得预测股价、暗示保证收益、把相关性画成因果，或将过期数据说成最新数据。
```

数据不足时输出 `insufficient_data` 和缺失字段；不以虚构走势图补全。
