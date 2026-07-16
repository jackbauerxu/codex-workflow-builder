# 生成式视频生产参考

本文件把 [zhouwei713/seedance-prompt](https://github.com/zhouwei713/seedance-prompt)（MIT）的真实感方法融入本仓库的视频生产合同：先定义素材从哪里来，再让设备、环境、时间轴和声音推导画面。它是对该方法的生产化改编；不要复制他人的画面、分镜、音乐或品牌资产。

## Source Identity

生成前先写一句可审查的素材身份：**谁、为何、用什么设备、在哪个年代记录这段画面**。然后补足四个输入：

- 拍摄者/机位：朋友、路人、Vlogger、固定机位、纪录片摄影师或无人操作的相机。
- 设备与年代：早期 DV、VHS、Super 8、当代手机、运动相机、CCTV 或专业纪录片手持。
- 主体与地点：谁、何时、何地，以及 5-8 个彼此一致的环境元素。
- 情绪目标：把“温暖、孤独、紧张”等词改写成光线、空间、身体动作和环境声。

| 设备语法 | 应保留的现实信号 | 不应混入 |
| --- | --- | --- |
| 早期 DV | 压缩噪点、对焦搜索、曝光波动、笨拙变焦 | 云台般平稳、现代商业调色 |
| VHS | 扫描线、色彩溢出、日期戳、偶发撕裂 | 数码锐利、高动态范围 |
| Super 8 | 颗粒、暗角、短硬切、18fps 轻顿 | 同期对白、数字级清晰度 |
| 当代手机 | 竖构图、HDR 痕迹、轻微倾斜、手指擦边 | 三脚架式稳定、影棚布光 |
| CCTV | 高位固定、低帧率、时间戳、无声 | 摄影师跟拍、主动变焦 |
| 纪录片手持 | 克制微晃、自然光、偶尔跟焦落后 | 摆拍、戏剧化轨道运镜 |

设备语法服务于生成资产本身；最终视频的字体、配色、UI、转场和字幕仍由选定的 `style_preset` 管理。

## Non-perfect event rule

每个 2-4 秒节拍选择一个自然事件：自动对焦迟滞、构图稍晚跟上主体、微风带动衣角、曝光随云影变化、路人短暂经过、人物整理头发或镜头在地面处切断。事件必须来自拍摄者、环境或主体的合理行为；同一段内不要重复，也不要为“去 AI 感”而让事件抢走叙事。

## Continuity Ledger

超过一个生成片段时，先创建一份 Continuity Ledger，再写任何单段 prompt：

```yaml
sequence_id: "2026-07-16-product-broll"
model: "Seedance"
source_identity: "2004 年同事用消费级 DV 记录工作台上的原型测试"
immutable:
  subject_identity: "same adult, dark knit sweater, tied hair"
  location: "small daylight workshop, scratched wooden desk, labelled storage bins"
  time_weather: "late afternoon, soft window light, overcast"
  camera_grammar: "early-DV: focus search, mild noise, exposure breathing"
  sound_bed: "room tone, fabric movement, distant ventilation"
  style_boundary: "minimal preset governs export typography and captions"
clips:
  - id: gen-01
    first_frame_anchor: "hand enters from left above open notebook"
    action_progress: "hand tests the prototype button"
    last_frame_anchor: "camera settles on the button and notebook edge"
  - id: gen-02
    first_frame_anchor: "same button and notebook edge, same light direction"
    action_progress: "focus moves from notebook note to button feedback"
    last_frame_anchor: "hand withdraws, desk remains in frame"
```

不可变字段不能在下一段悄悄更换。下一段的 `first_frame_anchor` 必须承接上一段的末帧、光线方向、人物外观和动作进度；不匹配时回到账本修正，而不是用随机新 prompt 补洞。

## Prompt QA Gate

在把提示词交给模型前逐项检查：

- Source Identity 是否说明了拍摄者、动机、设备与年代？
- 场景是否有足够具体、互不矛盾的环境元素？
- 设备语法是否含至少 4 个可见物理信号，且没有与负面约束冲突？
- 每个节拍是否都有动作、环境呼应与一个自然事件？
- 声音是否能在画面中找到来源？没有音乐/旁白时是否明确？
- 多段的首末帧锚点是否接续？人物、服装、地点、光线是否锁定？
- 生成资产是否只解释旁白，没有被写成新闻、产品或客户事实的证据？
- `status`、权利状态和真实文件路径是否诚实记录？

提示词、故事板或模型返回的缩略图 **not evidence of a render**。只有真实模型输出被保存、路径存在、并通过 still-frame/预览检查后，才能把 `status` 从 `planned` 更新为 `generated` 或 `accepted`。
