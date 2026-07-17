---
name: codex-workflow-builder
description: Use when the user wants to turn a fuzzy recurring computer task, content-production routine, business workflow, automated short-video editing routine, HyperFrames or Remotion video routine, or Skill/automation request into a reusable Codex workflow. Do not use for one-off factual Q&A, generic Codex tutorials, or tasks that only need a simple answer.
---

# Codex Workflow Builder

把“说不清但反复做”的任务变成可以检查、复跑和交接的 Codex 项目工作流。它负责父级流程合同；视频专项细节交给 `codex-remotion-daily-video`，或按本仓库的真实 Remotion starter 运行。

## Sources and boundaries

方法来自三篇 X 长文：

- xilo2991 的 Codex 工作流与自动化剪辑文章。
- GeekCatX 的 Codex + HyperFrames 工程化视频文章。

原文链接、引用边界和详细应用案例见 [workflow-patterns.md](references/workflow-patterns.md)。不要把来源文章中的单次案例误当成固定题材列表，也不要把工作流包装成精品电影制作承诺。

## R - Reading

核心判断：Skill 不是一次性答案，而是把目标、输入、输出、目录、步骤、人工判断和质量门固定下来，让下一次执行不必重新发现流程。

## I - Method

先判断任务是否重复、文件化、多步骤或有商业价值；再建立项目目录和 `Workflow Contract`；最后决定保留为提示词、项目 runbook、Skill，还是在至少一次人工验收后排期。

每一步都必须有：

```markdown
### Step N - Name
- Input:
- Action:
- Output:
- Check:
- If blocked:
```

视频任务按真实画面来源选择路线：参考视频剪映/CapCut 草稿、HyperFrames HTML 渲染、Remotion 日更生产线，或受控的生成式视频资产路线。详细路线操作见 [video-workflows.md](references/video-workflows.md)。

## Production System for Video Work

视频请求不能只写“调用工具 → 输出视频”。先建立可复现的 `Production Configuration`：

```yaml
production:
  content_format: "project format or custom description"
  style_preset: minimal | apple | tesla | bloomberg | cyberpunk
  format: "1080x1920 / 9:16 / 30fps"
  duration_seconds: 15-60
  verified_promise: text | unknown
  fact_sources: []
  reference_assets: []
  visual_source_mode: authorized_real | generated | hybrid
  generated_visuals:
    model: none | Seedance | Sora | Kling | Runway | Veo | other
    status: not_applicable | planned | not_rendered | generated | accepted | rejected
    source_identity: null
    continuity_ledger: null
    output_path: null
  script_templates: [opening, project-template, storytelling, outro, captions]
  shot_ids: []
```

`content_format` 是开放字段，不把项目硬塞进固定 lane。没有事实来源时，不能写精确数字、价格、性能、新闻事实或未经证实的结果。`planned` 和 `not_rendered` 资产不能进入最终时间线。

### Knowledge Routes

只读取当前请求需要的资料：

| Need | Read |
| --- | --- |
| 工作流来源、应用、合同与打包 | [workflow-patterns.md](references/workflow-patterns.md) |
| 剪映/CapCut、HyperFrames、Remotion 运行细节 | [video-workflows.md](references/video-workflows.md) |
| 开场、叙事、收尾、字幕 | `scripts/opening.md`, `scripts/storytelling.md`, `scripts/outro.md`, `scripts/captions.md` |
| 项目脚本与题材模板 | `scripts/README.md` 加一个最接近的项目模板 |
| TikTok、AI 演示、产品、开箱、新闻、B-roll | 对应的 `prompts/*.md` |
| Seedance 或其他生成式视频资产 | `prompts/generative-video.md`, `references/generative-video-production.md`, `examples/generative-video-sequence.md` |
| 镜头、构图、动效 | `references/shot-library.md`, `references/composition-examples.md`, `references/motion-examples.md` |
| Remotion 交接合同 | `remotion/production-contract.md` |

### Script Library

`scripts/` 的 AI 演示、产品、开箱、新闻、TikTok/Shorts、B-roll、教程、案例、对比和趋势模板只是可组合起点，不是封闭题材范围（not a closed taxonomy）。没有完全匹配的模板时，保留四个基础模板并记录 `custom beat map`：hook、proof、action/insight、evidence/asset needs、uncertainty/qualification、CTA。不能用一个泛化的旁白代替 beat map。

### Generative-video asset route

只有用户接受生成式资产、且真实素材不足时才使用。它融合 `realistic-video-prompting` / [zhouwei713/seedance-prompt](https://github.com/zhouwei713/seedance-prompt) 的方法，但不把 prompt、缩略图或设想画面说成已经交付的视频。

1. 记录 **Source Identity**：拍摄者、原因、设备/年代、主体/地点和情绪意图。
2. 用 `prompts/generative-video.md` 写七段式 prompt，保持一套设备语法，并为每个 beat 设置一个自然不完美事件。
3. 多段生成前写 **Continuity Ledger**，锁定身份、衣着、地点、时间/天气、相机语法、声音和首末帧锚点。
4. 导出排版、字体、字幕和转场仍由唯一 `style_preset` 控制；生成片段的相机语法只是局部质感。
5. 在资产清单中记录权利、状态和真实 `output_path`；只有通过 QA 的 `accepted` 资产能进入最终时间线。

### Style Lock

视觉生产前必须读取 `styles/` 中恰好一个预设。预设锁定字体、配色、网格、留白、字幕、运动和转场；**No generic-style override**：其它设计 Skill 不能静默覆盖。默认 `minimal`，新闻可选 `bloomberg`，产品可选 `apple`，性能内容可选 `tesla`，技术系统可选 `cyberpunk`。用户明确更换预设后，重新检查每个场景；预设不复制品牌 logo、专有 UI、素材、音乐或广告构图。

### Reference Assets

先读 `references/images/vertical-safe-area.svg`，再布局竖屏文字；用自制 SVG 分镜、构图和动效文档理解阅读路径，不把它们当成待追踪的素材。外部视频只记录授权并学习可迁移的节奏/构图原则，不能复制画面、剪辑序列、音乐、logo 或声音。

### Shot Library

需要写分镜时读取 `references/shot-library.md`，使用其中的 shot ID、景别、构图、动作和建议时长；每个 beat 只绑定一个 shot ID。

### Production Sequence

1. 建立 `Production Configuration` 并锁定一个预设。
2. 选择 opening、storytelling、outro、captions 和一个项目模板；事实密集内容先建 fact manifest。
3. 生成式资产先写 Source Identity 和 Continuity Ledger。
4. 写 beat sheet：每行一个 `shot_id`、资产需求、时长和来源/限定。
5. 用选定的构图与动效做 storyboard；缺素材写 `missing_asset`，不拿无关素材填空。
6. 先做静帧和低成本预览；**first preview is a candidate**，不是完成证据。
7. 通过风格锁、安全区、事实、画音匹配、动作克制、权利、生成资产状态和真实渲染产物 QA 后才交付。

### Few-shot examples

先读最接近的完整示例：`examples/ai-demo.md`、`examples/product-launch.md`、`examples/news-brief.md`；涉及生成视觉时再读 `examples/generative-video-sequence.md`。只适配输入、已验证事实、预设、beat 和镜头，不复制示例中的品牌、主张、图像或措辞。

## Workflow Contract

```markdown
## Workflow Contract
- Goal:
- Trigger:
- Inputs:
- Outputs:
- Project folder:
- Steps:
- Human review points:
- Quality checks:
- Stop conditions:
```

触发必须可执行，例如“用户把 10 个产品片段放入 `/inputs/raw-clips`”，而不是“制作视频时”。

## E - Execution

### 1. Identify Workflow Worthiness

回答：重复什么任务？每次输入是什么？最终输出是什么？多久运行一次？哪些判断必须留给人？如果任务不是重复的、少于三个有意义的步骤，直接解决，不要过度封装。

### 2. Create the Workflow Contract

先写合同，再设计目录、脚本、分镜或代码。输入检查、输出检查和人工 review 是每条路线的最低质量门。

### 3. Design the Project Workspace

默认目录：

```text
project-name/
├── inputs/
├── working/
├── outputs/
├── prompts/
├── logs/
└── README.md or RUNBOOK.md
```

稳定素材放 `assets/`，每次中间产物放日期目录，交付物只放 `outputs/`。当合同满足日更/周更短视频、结构化内容 JSON、Remotion composition 和 MP4 输出条件时，把专项细节交给 `codex-remotion-daily-video`。

### 4. Mandatory Video Production Environment Bootstrap

请求包含 preview、still frame、可编辑草稿或 MP4 时，先检查包管理器、锁文件、Node、浏览器运行时、FFmpeg 和对应 CLI；缺依赖时只在项目内安装并通过权限机制下载。运行诊断后才渲染。预览、脚本、storyboard 或 React composition 都不是 MP4，必须检查真实文件存在、非空、格式正确。失败时报告具体缺失工具和安全下一步，不虚构完成。

真实可运行的最小 Remotion 参考位于 `examples/remotion-starter/`，其本地顺序是：

```text
npm ci -> npm run typecheck -> npm run render:still -> npm run render:smoke -> npm run verify:artifacts
```

### 5. Package and Review

至少一次人工验收通过后，选择可复用提示词、项目 runbook、Skill 或定时任务。报告工作流名、文件位置、下次运行方式、用户首先要看的产物和仍需人工判断的部分。不要在依赖未安装、预览失败或真实产物缺失时声称视频完成。

## Quality Gates and boundaries

- 输入：必需文件、字段、来源和权利存在。
- 输出：交付物格式、路径、时长、分辨率和可解析性符合承诺。
- 内容：事实有来源，标题/字幕在安全区，镜头与叙事匹配，风格只有一个预设。
- 生产：低置信度素材标记 `missing_asset`；生成资产保留状态、权利和真实路径。
- Review：报告变更、产物、失败门和用户必须做的判断。

不要为单次问答、按钮位置、没有目标/输出标准的任务或强依赖真实表演和复杂情绪的高级原创大片设计工作流。自动化编辑定位是可规模化生产，不承诺精品创作；HyperFrames 强项是浏览器可表达的字幕、图表、截图、UI 和动效，而不是生成角色表演。

## Related references

- [workflow-patterns.md](references/workflow-patterns.md)：来源应用、父子路由、合同字段、打包与自动剪辑原则。
- [video-workflows.md](references/video-workflows.md)：剪映/CapCut、HyperFrames、Remotion 的详细运行步骤与故障门。
- `references/generative-video-production.md`：生成式资产的来源身份、设备语法、连续性和 QA。

## Audit

- Distillation date: 2026-07-07
- Verification: workflow contract、生产资料、Seedance 资产状态、风格锁、真实 Remotion starter 和可移植回归检查均有对应文件。
