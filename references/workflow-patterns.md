# Workflow Patterns and Source Notes

按需读取：当请求需要来源文章的应用逻辑、Workflow Contract 设计、父子 Skill 路由、自动剪辑资产匹配或打包决策时读取本文件。

## Source notes

本 Skill 蒸馏自：

- [5分钟入门Codex，一个工作流在抖音赚了5W+](https://x.com/xilo2991/status/2070051136187621452)
- [Codex自动化剪辑从0到1，开源我在抖音赚了5W+的剪辑工作流【万字长文】](https://x.com/xilo2991/status/2073752063591473242)
- [Codex + HyperFrames 自动剪辑视频：深度技术解析与工程化最佳实践](https://x.com/GeekCatX/status/2074182098626523388)

可复用的抽象是：重复任务必须有输入、输出、可观察目录、逐步执行、人工判断和停止条件；自动剪辑必须宁可留空，也不以无关素材填充；Codex 负责编排、代码和 review，渲染引擎负责确定性产物。

## Article applications

### Repeated content workflow

适用于 AI 资讯选题、日报/周报、公众号/小红书/短视频脚本、资料整理和业务流程。先定义运行频率、来源、存储位置和通知目标，再决定是否排期；不要从一次成功直接推断自动化稳定。

### Content article workflow

文章生产通常包含选题、结构、草稿、封面/插图、事实检查和交付。将每一步的输入输出写进合同，保留最终人工审阅点；这样下一次只更换内容，不更换流程边界。

### Reference-video draft workflow

适用于电商、营销、产品演示、轻量 Vlog 和批量混剪。需要用户自己的参考视频和素材库；只学习镜头节奏、构图和素材类型，不复制原片。低置信度匹配必须输出 `missing_asset` 与补素材建议。

### HyperFrames workflow

适用于字幕、图表、截图、产品页、UI 演示和浏览器可表达的动效。Codex 先写设计、脚本和 storyboard，再交给 HyperFrames 做预览、校验与 MP4；任何 composition、brief 或 preview 都不能冒充最终文件。

### Daily Remotion workflow

当目标是讲书、教程、产品讲解、观点解释或其他每周/每日重复栏目时，本 Skill 先定义父合同，再把内容 JSON、可复用组件、still frame 检查、render checks 和复盘交给 `codex-remotion-daily-video`。父级不复制子 Skill 的全部细节。

## Workflow Contract mapping

| Contract field | Decision to make |
| --- | --- |
| Goal | 受众、平台、节奏、交付标准 |
| Trigger | 事件、文件、时间或用户动作 |
| Inputs | 来源、事实、资产、权限、品牌规则 |
| Outputs | JSON、brief、草稿、still frame、MP4、日志 |
| Project folder | 稳定素材、working、outputs 的路径 |
| Steps | 每一步的输入、动作、输出、检查和阻塞处置 |
| Human review points | hook、事实、样片、静帧、最终产物 |
| Quality checks | 格式、时长、安全区、事实、路径、权利 |
| Stop conditions | 缺来源、缺权利、缺素材、缺审批、依赖失败 |

## Parent-child routing

若合同满足以下条件，路由给 `codex-remotion-daily-video`：

- 目标：每日/每周重复的短视频栏目。
- 输入：文章、书摘、产品说明、教程提纲、数据或产品更新。
- 输出：结构化内容 JSON、HyperFrames 样片 brief、Remotion composition、MP4。
- 人工判断：hook、内容格式、静帧、最终视频和模板改进。

父级交付：

```markdown
## Workflow Contract
- Goal: 每周把产品更新做成 60 秒竖屏视频
- Trigger: 新说明文件进入 inputs/updates/
- Inputs: 事实、授权截图、文案、视觉规则
- Outputs: content JSON、样片 brief、Remotion MP4
- Project folder: product-video/
- Steps: intake -> fact check -> storyboard -> preview -> render -> review
- Human review points: hook、事实、still frame、MP4
- Quality checks: 安全区、时长、字幕、来源、输出路径
- Stop conditions: 缺来源、权利或渲染运行时
- Child skill: codex-remotion-daily-video
```

## Reference-video matching rules

### Required files

- `recipe.json`：镜头序号、起止时间、时长、关键帧、转写/文字、场景、动作、构图、亮度、节奏和下游素材需求。
- `fragment_plan.json`：每个镜头需要的场景、动作、景别、素材类型和禁止匹配。
- `matches.json`：候选素材、匹配分、置信度、fallback 标记、权利和实际路径。

### Matching and handoff

先按颜色、亮度、构图、主体、运动、场景和景别匹配，再检查多样性，避免重复同一素材或相似镜头。置信度过低则保留空位并标记 `missing_asset`；禁止“为了完整”使用无关素材。

配音前检查文字；配音后测量真实音频时长，再调镜头、字幕和画音对齐。草稿必须使用存在的绝对路径、内部一致的 ID、复制到 working 的素材和可打开的根索引。

## Packaging decision

| Form | Use when |
| --- | --- |
| Reusable prompt | 步骤少、结构仍在探索 |
| Project runbook | 文件布局和交接比触发发现更重要 |
| Skill | 同一流程会反复调用，触发条件清晰 |
| Scheduled task | 已通过人工验收，运行时间固定 |

只有一次可接受的人工运行后才排期。Skill 需要 YAML metadata、触发场景、输入假设、逐步执行、质量门、失败/交接行为，以及正向、负向和边界测试。
