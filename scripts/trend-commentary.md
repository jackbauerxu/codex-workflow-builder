# 趋势与观点项目脚本

适用于对行业变化、创作趋势或工作方式的观点解读。把已发生的信号与个人推断分开，避免把预测伪装成事实。

输入：`observed_signal`、`source_refs[]`、`point_of_view`、`affected_audience`、`uncertainties[]`。

| 节拍 | 内容 |
| --- | --- |
| 信号 | 一个带时间和来源的已发生变化。 |
| 旧假设 | 过去为什么这样做仍然有效或失效。 |
| 新判断 | 这是创作者/团队的观点，明确标为分析。 |
| 可做动作 | 给受众一个低成本试验，而不是绝对结论。 |
| 不确定项 | 哪些变量仍会改变判断，以及下次验证点。 |

输出字段：`observed_signal`、`source_refs[]`、`analysis_statement`、`experiment`、`uncertainties[]`、`next_check`。任何趋势判断都不能省略来源或不确定项。
