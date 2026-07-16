# B-roll 叙事补位脚本

适用于已经有旁白、但缺少能解释句子的支持画面时。B-roll 是证明和转场工具，不是随机的氛围库存。

输入：`narration_lines[]`、`available_assets[]`、`style_preset`、`asset_rights`。

对每一句旁白按下面顺序选画面：

1. **动作**：谁在做什么，优先真实录屏或实拍。
2. **证据**：界面状态、文件、物件、来源卡或前后对照。
3. **关系**：用图示或构图解释因果、顺序、规模。
4. **停顿**：只有在需要留白、切换章节或承接 CTA 时才用。

输出字段：`narration_line`、`shot_id`、`asset_source`、`rights_status`、`proof_role`、`duration_seconds`、`missing_asset`。咖啡、键盘、城市延时和粒子背景不能仅因“好看”进入序列。
