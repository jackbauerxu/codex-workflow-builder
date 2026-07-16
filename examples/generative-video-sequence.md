# Few-shot：Seedance 生成式 B-roll 序列

## 输入

“我有用户授权的产品录屏，但开头缺少一段 12 秒的工作台过场。请做两段怀旧 DV 质感的生成式 B-roll；视频主体仍用 Minimal 风格。”

## Production Configuration

```yaml
production:
  content_format: "AI tool product explainer with generated workshop B-roll"
  style_preset: minimal
  visual_source_mode: hybrid
  generated_visuals:
    model: Seedance
    status: planned
    rights: generated_by_project
    output_path: null
    source_identity: "2004 年同事用消费级 DV 记录工作台上的原型测试"
    continuity_ledger: references/continuity/product-workshop.yaml
  script_templates: [opening, ai-demo, b-roll-sequence, storytelling, outro, captions]
```

真实产品录屏保留为 `authorized_real_asset`；两段生成画面只能承接“从手动整理到自动处理”的旁白，不能伪造产品界面或性能结果。

## Continuity Ledger 摘要

| 固定项 | 值 |
| --- | --- |
| 人物 | 同一位扎发、深色针织衫的成年人；不露脸也不更换衣服。 |
| 地点 | 午后小工作台：划痕木桌、打开的笔记本、标签收纳盒、窗边盆栽。 |
| 相机 | 早期消费级 DV：轻噪点、自动对焦搜索、曝光呼吸；无云台感。 |
| 声音 | 房间底噪、衣料摩擦、远处通风声；无配乐、无旁白。 |
| 风格边界 | Minimal 只管理导出的标题和字幕，不改变 DV 段的设备语法。 |

## 模型提示词交付

### gen-01 · 0:00-0:06

- **Source Identity**：2004 年同事用消费级 DV 随手记录原型测试，没有摆拍。
- **场景与镜头**：镜头从摊开的笔记本略迟地抬到工作台，人物左手从画面左边拿起无标识原型；窗边云影让曝光短暂变暗，对焦先落在纸面再回到手部。
- **声音与收束**：纸张轻响、衣料摩擦、通风声；画面停在原型按钮和笔记本边缘。
- **首末帧锚点**：`first=left hand above notebook`；`last=button and notebook edge in soft side light`。

### gen-02 · 0:06-0:12

- **承接**：第一帧必须从相同按钮和笔记本边缘开始，光线仍从右侧窗户进入。
- **动作**：对焦从笔记本上的手写流程移到按钮被按下后的机械反馈；人物手部短暂停顿，再从画面退出。
- **设备语法**：轻微压缩噪点、短暂对焦搜索、非居中构图；没有稳定、没有电影化运镜、没有现代商业调色。
- **收束**：手离开后保留两秒桌面空景，给真实产品录屏的第一帧做硬切交接。

## QA 与交付状态

| 检查 | 结果 |
| --- | --- |
| 连续性账本 | 通过：人物、桌面、光线、DV 语法和动作进度一致。 |
| 事实与权利 | 通过：生成段无品牌、界面、性能或客户结果主张。 |
| 模型执行 | `not_rendered`：本示例只提供 prompt 与计划，尚无真实输出文件。 |
| 下一步 | 模型实际运行后记录文件路径，做 still-frame/预览检查，再将状态更新为 `generated` 或 `accepted`。 |

不要复制本示例的物件、年代、人物或旁白；只复用其“来源身份 → 连续性账本 → 分段 prompt → 诚实状态”的交付结构。
