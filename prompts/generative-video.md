# 生成式视频资产提示词

适用于缺少一段关键 B-roll、过场或抽象解释画面，而用户明确接受用 Seedance、Sora、Kling、Runway、Veo 等模型生成资产的情况。它生成的是一条可投喂的提示词与资产计划，不等于已经生成或渲染了视频。

## 先建立资产记录

```yaml
generated_asset:
  model: Seedance | Sora | Kling | Runway | Veo | other
  status: planned | not_rendered | generated | accepted | rejected
  output_path: null
  rights: user_authorized | generated_by_project | unknown
  source_identity: "who filmed, why, with what device, in what era"
  supports_narration: "the exact line this visual proves or explains"
```

`planned` 表示还没有可投喂的定稿 prompt；`not_rendered` 表示已有 prompt 但模型尚未产生文件；两者都不能在分镜、预览或交付清单中写成已完成素材。`generated` 仍需 QA，只有带真实路径的 `accepted` 素材可进入最终时间线。`unknown` 权利状态不能进入最终渲染。

## 输入

`narration_line`、`model`、`duration_seconds`、`aspect_ratio`、`Source Identity`、`subject_and_place`、`mood`、`available_real_assets`、`continuity_ledger`（多段时必填）。缺项时只问能决定真实感或连续性的最小问题：谁拍、用什么设备/年代、主体在哪里、想要什么情绪。

## 输出：seven sections

按下面 seven sections 输出模型提示词；不要把它们混成一串泛化风格词。

1. **Source Identity**：谁为哪个目的拍下，设备与年代是什么；它决定镜头为什么不完美。
2. **Subject and place**：可见的主体、时间、地点和互相印证的环境物件。
3. **Visual texture**：把情绪译为可拍到的光线、空间、动作和材质，不写“高级”“唯美”“电影感”。
4. **Camera grammar**：用与设备一致的物理现象，例如 DV 的自动对焦搜索或手机的轻微倾斜；同时写出该设备不应出现的特征。
5. **Timeline**：以时间码写每个 2-4 秒节拍；每拍含主体动作、环境呼应和一个不重复的自然失误。
6. **Audio**：列出与画面一一对应的现场声音；没有声音或不需要音乐时明确说明。
7. **End anchor**：写清最后一帧/动作如何收束，以及这段资产要帮助观众理解什么。

## 约束

- 一个生成片段只使用一套设备语法；设备语法是片段质感，不得覆盖 `style_preset` 的字幕、版式、字体或转场锁。
- 每段只放一个非完美事件，例如对焦迟滞、云影导致的曝光变化、路人短暂遮挡或主体的自然停顿；不能把多种失误堆在同一秒。
- 生成画面不能伪造客户结果、产品界面、新闻事实、人物身份或未授权素材。它只能解释旁白，不能充当事实来源。
- 多段生成前必须读取 `references/generative-video-production.md` 的 Continuity Ledger；每段输出首帧锚点、末帧锚点和交接动作。
- 交付时回写 `status` 与真实 `output_path`。模型没有实际运行时，交付状态是 `not_rendered`。
