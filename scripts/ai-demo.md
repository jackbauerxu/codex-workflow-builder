# AI 演示项目脚本

适用于有真实录屏、可复现输入和已确认功能边界的 AI/SaaS 演示。

输入：`user_problem`、`recorded_task`、`verified_result`、`screen_assets`、`fact_sources`。

| 节拍 | 时长 | 旁白与画面 |
| --- | --- | --- |
| 任务钩子 | 0-3 秒 | 说出具体摩擦；录屏停在开始前的状态。 |
| 一次输入 | 3-7 秒 | 展示真实输入或操作，不跳过关键条件。 |
| 三个可见变化 | 7-21 秒 | 每个变化只配一个镜头：操作、界面反馈、结果。 |
| 结果边界 | 21-27 秒 | 说明它完成了什么，以及仍需要人工判断的地方。 |
| 单一 CTA | 27-30 秒 | 邀请观众用自己的任务复现。 |

输出字段：`hook_line`、`demo_steps[]`、`screen_state_before`、`screen_state_after`、`verified_result`、`limitation`、`shot_ids[]`。

不得把模拟界面、占位数据或未录到的结果剪成真实演示；缺少录屏时输出 `missing_asset`，不假装功能已跑通。
