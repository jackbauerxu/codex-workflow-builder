# 已有 MP4 的增量编辑

> 适用：用户已经有一段或几段导出成 MP4 的粗剪/成片，要求在现有成片上做转场、调色、配乐、片头/片尾、叠字等增量编辑。

## Route fit

- 如果用户拿的是剪映/CapCut 草稿、素材库和可重排时间线，走参考视频草稿路线（见 `references/video-workflows.md`）。
- 如果需求是代码化、可参数化生成和可复现的日更模板，走 Remotion 路线。
- 如果用户拿的是已导出的 MP4，且不再保留可编辑工程，只能走本路线。

关键事实：**导出 MP4 已经丢失剪辑点**。所有切点只能靠场景检测近似，或由用户直接提供时间码确认。

## Step 1 — Ledger

1. 复制 `templates/edit-manifest.template.json` 到工作目录，例如 `working/edit-manifest.json`。
2. 逐项回显每条需求：转场位置、调色方向、配乐类型、片头/片尾、叠字内容，并让用户确认。
3. 每条需求只能处于 `planned | implemented | blocked | waived` 之一；没有“先空着以后再说”。

## Step 2 — Probe

```bash
node tools/probe-media.mjs <video> --out working/probe.json
```

读取分辨率、时长、音轨、场景切点。

把场景切点填到 `edit_plan.transitions.cut_points`；这些切点是候选，必须交用户改/确认。

## Step 3 — Asset gate

逐项收集资产，并写入账本对应项：

- **音乐文件**：选曲是人工判断点，工具只做混音，不代替选曲。
- **片尾动态资产**：必须是有 video 流的真视频。静态图顶替动态资产是红线，宁可 `blocked` 也不降级。
- **生成式资产**：走 `prompts/generative-video.md` + `tools/generate-asset.mjs`，只有状态变为 `accepted` 才能进入账本和渲染。
- **中文字体文件**：例如思源黑体 .otf。缺失即标 `blocked` 并写明缺什么；提示 `brew install --cask font-source-han-sans`。

任何资产缺失：对应需求标 `blocked` 并写明缺什么。**不得静默跳过，不得拿无关素材填空。**

## Step 4 — Render

填 `edit_plan`，字段示例：

```json
{
  "edit_plan": {
    "source": "<原片路径>",
    "output": "<输出路径>",
    "transitions": {
      "enabled": true,
      "duration": 0.5,
      "cut_points": [4.0, 7.8]
    },
    "color": {
      "preset": "warm"
    },
    "music": {
      "file": "assets/music.mp3",
      "fade_in": 1,
      "fade_out": 2,
      "duck_db": -15
    },
    "end_card": {
      "video": "assets/endcard.mp4",
      "text": "向世界出发，向未来奔跑",
      "font_file": "/path/SourceHanSansSC-Bold.otf",
      "text_fade_in": 0.5
    }
  }
}
```

跑：

```bash
node tools/render-existing-mp4.mjs <manifest>
```

工具会在渲染前再跑一遍资产硬闸，带病拒渲。

## Step 5 — Verify and review

```bash
node tools/verify-delivery.mjs <manifest>
```

全绿后，把预览交人工确认——**情绪、节奏、音乐卡点是人工判断点**，“感人”不承诺自动判定；调色只做预设级。

交付报告逐项引用账本状态：`implemented` 项对应交付物；`blocked` 项说明缺什么；`waived` 项说明谁确认放弃。

## Failure rules

- 输出与原片 sha256 相同 = 失败。
- 存在 `planned` / `blocked` 项但交付说明未解释 = 失败。
- 末卡使用静态图 = 失败。
- 无字体渲染中文 = 失败。
