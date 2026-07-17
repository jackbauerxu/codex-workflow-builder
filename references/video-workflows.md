# Video Workflow Operations

按需读取：当需要执行参考视频剪辑、HyperFrames 预览/渲染、Remotion 项目引导或视频环境排障时读取本文件。

## Shared intake

先收集来源、目标平台、比例/分辨率、时长、风格预设、关键元素、声音/配音、输出路径、权限和 review 点。没有来源、权利、目标或输出标准时，先停在 intake，不编造素材或事实。

## Reference-video to Jianying/CapCut draft

### 1. Prepare

确认 FFmpeg、Python 3.8+、可用配音方案和桌面编辑器；不要重排用户原始素材。建立：

```text
video-project/
├── AGENTS.md
├── assets/{appearance,function,scene,human-shot}/
└── work/YYYY-MM-DD/{reference,reference_segments,keyframes,matched_assets,voiceover,subtitles,preview,jianying_draft}/
```

### 2. Analyze reference

切分参考视频、抽取关键帧和文字，生成 `recipe.json`。明显分割错误先让人 review，再进行匹配。

### 3. Plan and match

生成 `fragment_plan.json` 和 `matches.json`。记录场景、动作、景别、素材类型、候选文件、分数、置信度、fallback、权利和路径。低置信度输出 `missing_asset`，不使用无关视频填空。

### 4. Audio and draft

用户确认脚本后再生成配音；测量真实音频时长，调整镜头和字幕。草稿使用存在的绝对路径、全局唯一 ID、内部一致的 metadata 和复制后的 working 素材。

### 5. Review

检查草稿能打开、素材显示、镜头节奏、字幕安全区、画音同步、低置信度清单和最终路径。交付的是可编辑草稿时，不能声称已经完成 MP4。

## HyperFrames HTML workflow

### Route fit

选 HyperFrames 的条件：内容可表示为 HTML/CSS/JavaScript、字幕、图表、截图、产品页或 UI 模拟；需要重复预览和确定性 MP4。若核心是替换真实片段并继续在编辑器精修，选上一节的草稿路线。

### Environment bootstrap

在真实项目中检查 Node、包管理器、锁文件、HyperFrames、Chrome/浏览器运行时和 FFmpeg。缺依赖只在项目目录安装并记录版本；先跑诊断，再构建 composition。网络和系统级安装必须走权限机制，禁止 `sudo`。

### Review chain

```text
Design -> Script -> Storyboard -> HTML review page -> Timeline preview -> Validate -> Render -> Review
```

每个阶段都留下文件和检查结果：设计锁定受众/平台/时长/风格；脚本锁定来源和字幕；storyboard 给每段时间戳；review page 允许人工检查；preview 只作候选；validate 检查结构/路径；render 生成真实 MP4。

### Composition contract

检查 root 的 composition id、宽、高和 metadata；有时间的元素使用 `class="clip"`、开始时间、时长和 track index；timeline 必须注册，GSAP timeline 必须 paused；video 静音并独立处理音频；禁止无 seed 的随机数；构建过程同步；所有 asset path 都存在。

### Render loop

```text
init -> lint -> validate -> inspect -> preview -> render -> review
```

`lint` 查结构，`validate` 查运行时/路径/对比度，`inspect` 查 scene/clip/timeline，`preview` 查节奏/布局/字幕，`render` 查编码和真实输出。失败时修复对应门，不用“看起来差不多”跳过。

## Remotion production workflow

当格式已经证明可复用或需要 JSON 驱动批量输出时，使用 Remotion。稳定部分（主题、scene components、字幕、安全区、封面规则、render commands、acceptance checks）写在代码；变化部分（title、hook、scenes、captions、asset refs、voiceover、duration）写在内容数据。

最小目录：

```text
daily-video/
├── AGENTS.md
├── package.json
├── src/{Root.tsx,compositions/,components/,styles/}
├── content/YYYY-MM-DD-topic.json
├── public/assets/
├── scripts/{render-daily.mjs,verify-artifact.mjs}
└── outputs/
```

先判断格式是否已验证；未验证先用 HyperFrames brief 做 1–3 个样片。已验证时再用一套 composition 支持多个内容 JSON。每次 render 前先 still frame，再完整 MP4。

### Render checks

- title 长度、字幕溢出和安全区。
- 颜色对比、logo/关键元素位置和封面可读性。
- scene timing、画音关系、素材权利和生成资产状态。
- output path、分辨率、帧率、时长和文件签名。

`examples/remotion-starter/` 是本仓库的最小可运行证据：它固定 `minimal`，使用 1080×1920、30fps、60 帧、无外部素材的 typed data，并依次执行 `typecheck`、still、H.264 smoke render 与 `verify:artifacts`。

## Failure and handoff rules

- 缺依赖：报告工具、版本、失败命令和需要的权限；不报告已渲染。
- 缺素材：输出 `missing_asset` 与补充建议；不拿无关素材替代。
- 缺来源/权利：停在 fact/rights gate；不把数字、价格、案例或结果写成事实。
- 预览通过但渲染失败：保留 preview 状态，修复运行时后重跑；preview 不是 MP4。
- 外部编辑器不可用：交付可编辑草稿和人工 handoff，明确不能静默导出。
