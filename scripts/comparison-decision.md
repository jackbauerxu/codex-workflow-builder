# 对比与选型项目脚本

适用于产品、工具、工作流或方案的公平对比。先公布标准，再给同条件下的证据，最后说明适用边界。

输入：`decision_question`、`options[]`、`criteria[]`、`evidence_by_option`、`audience_constraints`。

1. **决策问题**：谁在什么限制下需要选。
2. **比较标准**：先于结论出现，最多 3 项且对所有选项相同。
3. **同条件证据**：每项标准给可复查的素材、录屏或来源；没有证据写 `unknown`。
4. **条件结论**：用“如果…则…”表达选择，而不是宣称唯一赢家。
5. **复查 CTA**：邀请观众按自己的约束重看标准。

输出字段：`decision_question`、`criteria[]`、`evidence_matrix`、`unknowns[]`、`conditional_recommendation`。禁止虚构跑分、拉踩竞争者或在不同条件下拼接对比。
