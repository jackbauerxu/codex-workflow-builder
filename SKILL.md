---
name: codex-workflow-builder
description: Convert a repeated computer task, content-production routine, business workflow, automated short-video editing routine, HyperFrames or Remotion video routine, or "make this into a Codex Skill / automation" request into a concrete Codex project workflow with inputs, folder structure, execution steps, quality checks, and optional Skill or scheduled-task packaging. Use when the user wants to turn a fuzzy recurring process into a reusable Codex workflow. Do not use for one-off factual Q&A, generic Codex tutorials, or tasks that only need a simple answer.
---

# Codex Workflow Builder

Sources:

- X article by xilo2991, "5分钟入门Codex，一个工作流在抖音赚了5W+", published 2026-06-25. Original link: https://x.com/xilo2991/status/2070051136187621452
- X article by xilo2991, "Codex自动化剪辑从0到1，开源我在抖音赚了5W+的剪辑工作流【万字长文】", published 2026-07-05. Original link: https://x.com/xilo2991/status/2073752063591473242
- X article by GeekCatX, "Codex + HyperFrames 自动剪辑视频：深度技术解析与工程化最佳实践", published 2026-07-06. Original link: https://x.com/GeekCatX/status/2074182098626523388

## R - Reading

> "Skill 的作用就是把很多重复、复杂的流程固定下来。这样你下次执行同样的任务时，只需要调出Skills就可以一键执行。"
>
> "如果你想要设置一个好用的自动化任务...整个流程的每一个环节你都要写得非常清楚，甚至说是做成 skill，然后再让 Codex 去自动调用。"

> "这套工作流的定位是自动生产，不是精品创作。"
>
> "宁可留空素材，也不要用无关素材硬凑。"

> "Codex 负责「编排 + 写代码 + 审阅闭环」，HyperFrames 负责「把 HTML 变成确定性 MP4」。"

## I - Method

Treat Codex as a project-based task runner, not only a chat window. A useful workflow has five parts:

1. A concrete task that recurs or has multiple moving parts.
2. A project folder where every input, intermediate file, and final output has a known place.
3. A step-by-step runbook Codex can execute without rediscovering the process.
4. A review loop: check output quality, let the user correct direction, then refine the runbook.
5. A packaging decision: keep it as a reusable prompt, turn it into a Skill, or schedule it as a recurring task.

The goal is not to describe Codex features. The goal is to make a user's real workflow executable, repeatable, and easy to inspect.

For short-video editing, choose one of two routes:

- Reference-video draft route: use a proven reference video as the structure, analyze its shot rhythm, match the user's own asset library to each shot, generate voiceover and subtitles, then assemble an editable Jianying/CapCut draft.
- HyperFrames render route: use Codex to orchestrate script, storyboard, HTML visual scenes, subtitle timing, preview, validation, and deterministic MP4 rendering through HyperFrames.
- Daily Remotion route: use `codex-remotion-daily-video` when the user wants repeatable knowledge, tutorial, book-summary, product-explainer, data-explainer, quote, podcast-clip, product-update, or course-clip videos as a daily production line.

The user remains responsible for source material, final review, and manual fixes where automated matching confidence is low.

## A1 - Article Applications

### Ecommerce video workflow

- Problem: producing ecommerce short videos required repeated work across trend analysis, material selection, voice, music, and subtitle alignment.
- Method: convert the whole production line into a Codex-executed workflow.
- Result: output efficiency increased because Codex could repeatedly follow the same production path.

### Content article workflow

- Problem: creating a post required outlining, drafting, cover generation, and illustrations.
- Method: let Codex handle the full project inside one workspace, then let the human adjust details at the end.
- Result: the article became a reusable content-production pattern rather than a one-off chat.

### Daily brief workflow

- Problem: daily information collection and topic selection were recurring tasks.
- Method: define when to run, what sources to use, where to save results, and how to notify the user.
- Result: the repeated daily task can become an automation after the process is clear.

### Reference-video editing workflow

- Problem: manually recreating the rhythm of a high-performing short video requires repeated shot cutting, material search, timing, subtitle alignment, and draft assembly.
- Method: put a reference video and a categorized asset library into a project workspace; let Codex produce a shot recipe, match reusable assets, generate voiceover and subtitles, and create an editable Jianying/CapCut draft.
- Result: the workflow is suitable for high-volume mixed-material videos such as ecommerce, marketing, and simple montage content.

### HyperFrames rendering workflow

- Problem:口播、教程、产品讲解和信息图视频的后期工作，常常卡在字幕对齐、动效叠层、标注、时间线调整和重复渲染。
- Method: let Codex design the storyboard and write HTML/CSS/JS composition files, then let HyperFrames preview, validate, and render deterministic MP4 output.
- Result: the workflow is suitable for repeatable explainer videos, article-to-video, product promos, GitHub/README demos, data-driven charts, and CI-friendly video generation.

### Daily Remotion video workflow

- Problem: knowledge, book-summary, tutorial, product-explainer, and data-explainer creators often repeat the same video structure every day.
- Method: first use this skill to define the Workflow Contract, then route the stable video-production details to `codex-remotion-daily-video`.
- Result: the workflow becomes a parent-child setup: this skill owns the reusable process contract; `codex-remotion-daily-video` owns video lane, JSON schema, HyperFrames validation, Remotion templates, and render checks.

## A2 - Trigger Scenarios

Use this skill when the user says or implies:

- "把这个流程做成 Codex 工作流 / Skill / 自动化任务"
- "我每次都要做这些步骤，帮我固定下来"
- "这个任务能不能让 Codex 自动执行"
- "帮我设计一个项目目录和执行流程"
- "我有一个业务流程，想让 Codex 跑起来"
- "我有参考视频和素材库，帮我自动生成剪映草稿"
- "把这个爆款视频结构做成自己的带货视频流程"
- "帮我搭一个自动化剪辑 Skill"
- "用 Codex + HyperFrames 做一个可复现的视频生成流程"
- "用 Codex + HyperFrames + Remotion 做视频日更生产线"
- "把讲书号 / 数据科普 / 工具教程 / 产品讲解做成每天可复用的视频模板"
- "先把视频生产流程规划清楚，再交给 codex-remotion-daily-video 落地"
- "把文章 / PDF / README 做成带字幕和动效的短视频"
- "帮我设计 HyperFrames 的预览、校验、渲染工作流"
- "turn this process into a Codex workflow / skill / automation"

Do not use it when:

- The user only asks where a button is or how one Codex feature works.
- The user asks for a single direct output and no reusable process is needed.
- The task requires reading a specific external source first; fetch the source before designing the workflow.
- The user wants high-end original cinematography, delicate emotional pacing, or heavily art-directed transitions; recommend a human-led creative workflow instead.
- The user wants AI drama, generated character performance, or image-to-video-heavy work; route to a media generation workflow rather than HyperFrames-first rendering.

## E - Execution

### 1. Identify Workflow Worthiness

Ask or infer:

- What task should be repeated?
- What input does the user provide each time?
- What output should exist at the end?
- How often does it run: ad hoc, daily, weekly, per project, or per file?
- What human judgment must stay in the loop?

If the task is not recurring and has fewer than three meaningful steps, solve it directly instead of overbuilding a workflow.

### 2. Create the Workflow Contract

Write a compact contract before implementation:

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

Make the trigger operational, such as "when the user drops 10 product clips into `/inputs/raw-clips`" rather than "when making videos."

### 3. Design the Project Workspace

Use a predictable folder shape unless the existing project already has a better convention:

```text
project-name/
├── inputs/
├── working/
├── outputs/
├── prompts/
├── logs/
└── README.md or RUNBOOK.md
```

Use:

- `inputs/` for user-provided source material.
- `working/` for intermediate drafts, extracted data, or temporary structured files.
- `outputs/` for final deliverables.
- `prompts/` for reusable prompts or role instructions.
- `logs/` for run notes, decisions, or execution summaries.

If the workflow will become a Skill, keep the reusable instructions in the skill's `SKILL.md` and only keep project-specific files in the project folder.

### Parent-Child Skill Routing

Use this skill as the parent when the user starts with a fuzzy repeatable process. After the Workflow Contract is clear, route specialist work to a child skill instead of copying every specialist rule into this skill.

Route to `codex-remotion-daily-video` when the workflow contract says:

- Goal: daily or weekly repeatable short-video production.
- Inputs: article, book note, product note, data point, tutorial outline, quote, podcast clip, or product update.
- Outputs: structured content JSON, HyperFrames sample brief, Remotion composition, rendered MP4, or video production runbook.
- Repetition pattern: one or more videos per day/week, same lane or same visual system.
- Human review: approve hook, content lane, sample direction, still frame, final MP4, or template improvement.

Parent output before routing:

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
- Child skill: codex-remotion-daily-video
```

Then use `codex-remotion-daily-video` for:

- Engine choice: HyperFrames validation, Remotion production, or both.
- Content lane: book-summary, product-explainer, data-explainer, tool-tutorial, opinion-explainer.
- Content JSON schema and daily-changing fields.
- Reusable video modules.
- Still-frame checks, render checks, and review loop.

Keep the boundary clean: this skill decides whether the work deserves a reusable workflow and defines the contract; the child skill decides how the repeatable video production line should operate.

For automated short-video editing, use this specialized shape:

```text
video-project/
├── AGENTS.md
├── assets/
│   ├── appearance/
│   ├── function/
│   ├── scene/
│   └── human-shot/
└── work/
    └── YYYY-MM-DD/
        ├── reference/
        ├── reference_segments/
        ├── keyframes/
        ├── matched_assets/
        ├── voiceover/
        ├── subtitles/
        ├── preview/
        └── jianying_draft/
```

Put stable, reusable materials in `assets/`. Put each new video's reference file, intermediate files, and final draft under one dated `work/` folder. Include an `AGENTS.md` that states project goal, target platform, video length, tone, output format, asset rules, and review standards.

For HyperFrames projects, use this shape:

```text
hyperframes-video/
├── AGENTS.md
├── index.html
├── assets/
│   ├── audio/
│   ├── images/
│   ├── video/
│   └── data/
├── scripts/
├── outputs/
│   ├── preview/
│   └── final/
└── notes/
    ├── script.md
    ├── storyboard.md
    └── review-notes.md
```

Keep brand style, aspect ratio, motion vocabulary, subtitle rules, and render quality in `AGENTS.md` so future videos inherit the same defaults.

### 4. Convert the Process Into Steps

For each step, define:

- action: what Codex should do;
- tool or file: what it should read, write, or run;
- completion standard: how to know the step is done;
- handoff: what the next step receives.

Prefer this format:

```markdown
### Step N - Name
- Input:
- Action:
- Output:
- Check:
- If blocked:
```

Keep steps small enough that a user can interrupt and redirect without losing the whole run.

### 5. Add Quality Gates

Every workflow needs at least three checks:

- Input check: required files or fields exist.
- Output check: final deliverable matches the promised format.
- Review check: Codex reports what changed, where outputs live, and what still needs human judgment.

For content workflows, include checks for audience fit, factual claims, tone, structure, and asset completeness.
For file workflows, include checks for filenames, expected counts, parse success, and no empty outputs.
For recurring workflows, include checks for date range, duplicate handling, save location, and notification target.
For HyperFrames workflows, include checks for composition contract validity, asset paths, subtitle safe area, preview review, deterministic output, and final render location.

### 6. Package the Workflow

Choose the lightest durable form:

- Reusable prompt: use when the process is short and still changing.
- Project runbook: use when file layout and handoff matter.
- Skill: use when the user will ask for the same workflow repeatedly.
- Scheduled task: use when timing matters and the workflow already runs reliably.

If creating a Skill, include:

- clear YAML `name` and `description`;
- trigger scenarios;
- inputs and required assumptions;
- exact execution steps;
- quality gates;
- failure and handoff behavior;
- `test-prompts.json` with positive, negative, and edge cases.

### 7. Return a Practical Deliverable

End with:

- the workflow name;
- where files were created;
- how to run it next time;
- what the user should inspect first;
- whether it is ready for Skill packaging or scheduled execution.

## Short-Video Editing Workflow

Use this section when the user's reusable workflow is automated editing from a reference video.

### Fit Check

Proceed when:

- The target is high-volume mixed-material video: ecommerce, marketing, simple montage, product demo, or lightweight Vlog.
- The user can provide a reference video and their own material library.
- The expected output is an editable Jianying/CapCut draft, not a final untouched masterpiece.

Do not present this as a fit when:

- The user needs precise original storytelling, nuanced performance, or complex visual language.
- The available asset library is too thin for matching.
- The user cannot review the generated draft before publishing.

### Required Inputs

Collect or create:

- reference video path;
- asset library path;
- target platform and aspect ratio;
- target duration or acceptable range;
- voiceover provider or "no voiceover";
- subtitle style and safe area preferences;
- Jianying/CapCut draft location;
- product or topic constraints;
- review standard: what counts as acceptable, missing, or wrong.

### Step 1 - Prepare Tools and Project

Check that the environment has:

- FFmpeg for video splitting, frame extraction, transcoding, and assembly;
- Python 3.8 or newer for workflow scripts;
- a voiceover option, such as Doubao voice model or a local voice cloning tool when the user explicitly wants that;
- Jianying/CapCut desktop if the final output is an editable draft.

Create the project folders before processing files. Never reorganize the user's original asset library unless asked. Copy selected assets into the current `work/` folder.

### Step 2 - Analyze the Reference Video

Split the reference video into shots, extract keyframes, and create a central `recipe.json`.

`recipe.json` should include:

- shot index;
- start and end time;
- duration;
- keyframe path;
- detected text or transcript when available;
- visual notes such as scene, motion, subject, framing, color, brightness, and pace;
- downstream requirement for the replacement shot.

Ask the user to inspect obvious segmentation errors. If a complete shot is split incorrectly or two shots are merged, adjust before matching materials.

### Step 3 - Plan and Match Materials

Create two planning files:

- `fragment_plan.json`: what each shot needs, including scene, action, framing, material type, and forbidden matches;
- `matches.json`: selected material for each shot, match score, confidence, and whether the choice is a fallback.

Match by useful visual signals first: color, brightness, composition, subject, motion, scene type, and shot size. Add variety rules so the same material or same-looking shot does not repeat too often.

Quality rule: leave a shot unfilled when confidence is too low. Do not fill a slot with an unrelated material just to complete the timeline. Mark it as `missing_asset` and tell the user what kind of asset to add.

### Step 4 - Generate Voiceover and Subtitles

Extract or draft the script, then ask the user to review the text before generating audio. After audio generation:

- measure the real audio duration;
- adjust shot durations so voice and picture remain aligned;
- generate subtitle files;
- check that subtitles do not cover key product or face areas.

If the reference video's text extraction is uncertain, keep a manual review point before audio generation.

### Step 5 - Build Preview and Jianying/CapCut Draft

Generate a preview video first when possible. Then build the editable draft with strict file references:

- use absolute material paths required by the draft format;
- confirm every referenced file exists;
- create fresh draft identifiers for content, metadata, and root index;
- keep IDs internally consistent;
- do not collide with existing drafts;
- preserve copied working materials so the draft opens later.

The first draft can take longer because draft metadata is strict. Treat any open failure as a format or path issue first, then inspect audio, subtitles, and material timing.

### Step 6 - Review Checklist

Ask the user or perform automated checks for:

- draft opens normally;
- all materials display;
- shot order and duration follow the intended rhythm;
- subtitles are readable and placed safely;
- voiceover and picture are synchronized;
- low-confidence matches are clearly reported;
- copied files remain in the work folder;
- final output path is reported.

### Step 7 - Package as a Skill

When the workflow has completed at least one acceptable manual run, offer to package it as a dedicated editing Skill. The Skill should include:

- expected folder structure;
- dependency checks;
- reference analysis instructions;
- matching rules;
- missing-asset behavior;
- voiceover and subtitle rules;
- draft-generation checks;
- test prompts covering ecommerce, marketing, montage, and non-fit high-end original video cases.

## HyperFrames Video Workflow

Use this section when the user wants Codex to create repeatable HTML-driven videos, animated explainers, article-to-video output, product promos, or CI-ready rendered MP4 files.

### Route Selection

Choose HyperFrames when:

- the video can be expressed as HTML, CSS, JavaScript, subtitles, motion graphics, charts, screenshots, product pages, or interface simulations;
- the user needs repeatable preview and render behavior;
- the output should be an MP4 rather than an editable Jianying/CapCut draft;
- the workflow benefits from slash-command Skills and project-level conventions.

Choose the Jianying/CapCut route instead when the core job is replacing shots in a reference video with user-provided clips and continuing manual editing in a desktop editor.

### Required Inputs

Collect:

- source material: script, article, PDF, README, CSV, raw talking-head video, screenshots, or product assets;
- target duration, aspect ratio, platform, and resolution;
- visual style: minimal, high-energy social, warm grain, Swiss grid, dark mode, luxury, or another concrete style;
- key elements: title, subtitle treatment, lower third, logo, chart, screenshots, background video, and music;
- voice/TTS provider if needed;
- render quality: draft, standard, or high;
- output path and review checkpoints.

### Step 1 - Initialize and Check Environment

Prefer a project initialized with HyperFrames tooling and related Skills. Before making the video:

- confirm Codex is available;
- confirm HyperFrames starts;
- confirm FFmpeg and Chrome runtime are healthy through the HyperFrames diagnostic command when available;
- run the project from a real folder with assets stored under `assets/`.

### Step 2 - Build the Review Chain

Use a staged review flow:

1. Design: define purpose, audience, platform, duration, and style.
2. Script: write or adapt narration and on-screen text.
3. Storyboard: split the timeline into scenes or subtitle-aligned segments.
4. Visual page: build an HTML storyboard or review page where the user can inspect each segment.
5. Timeline preview: align animations to subtitles or scene timestamps.
6. Render: create deterministic MP4 output only after preview approval.

When source footage is a talking-head or tutorial, first generate a review page for cuts, pauses, retakes, and subtitle alignment. The user should approve the cut decisions before HTML scene work continues.

### Step 3 - Prompt for Stable Output

For a cold start, specify:

- duration: exact seconds or scene count;
- aspect ratio: 16:9, 9:16, 1:1, or explicit dimensions;
- style and mood;
- key assets and file paths;
- subtitle style;
- music and voice requirements;
- final render target.

For a warm start, combine research or summary with production: let Codex read the source, extract the structure, then produce the video plan and composition from that same material.

Iterate with small, concrete changes after the first preview, such as changing title size, moving subtitles, adding a lower third, switching to dark mode, or replacing a background track.

### Step 4 - Enforce the Composition Contract

When writing or reviewing HyperFrames composition files, check:

- the root element has composition id, width, and height metadata;
- timed elements use `class="clip"` with start, duration, and track index metadata;
- timelines are registered so the renderer can seek animations;
- GSAP timelines are created paused when GSAP is used;
- video elements are muted and audio is handled separately;
- no unseeded randomness is used;
- timeline construction is synchronous;
- every asset path exists.

Prefer default 1920x1080 at 30fps unless the user has a concrete delivery reason for heavier output.

### Step 5 - Preview, Validate, and Render

Use the development loop:

```text
init -> lint -> validate -> inspect -> preview -> render -> review
```

Interpret failures by location:

- lint: structure or composition contract issue;
- validate: runtime error, missing asset, contrast, or renderability issue;
- inspect: internal scene, clip, or timeline structure;
- preview: visual timing, layout, subtitles, and pacing;
- render: final encoding and output file generation.

Render draft quality for early iteration, standard for stakeholder review, and high only for final delivery.

### Step 6 - Package as a Skill or CI Workflow

When a HyperFrames workflow repeats, package:

- project folder structure;
- style vocabulary and brand defaults;
- prompt starting forms;
- composition contract checks;
- preview and review checkpoints;
- render command and output naming;
- regression or CI expectations when deterministic rendering matters.

Do not ask for React or Vue components as the core artifact. Ask for HyperFrames-compatible HTML composition unless the project already has a specific integration reason.

## B - Boundaries

Do not turn every task into a workflow. The article's logic is strongest when work is repetitive, multi-step, file-based, or commercially useful. Avoid workflow design when a direct answer, a quick edit, or a one-time draft is enough.

Do not hide uncertainty. If input sources, accounts, file permissions, schedule, or notification target are unknown, mark them as assumptions or request the missing detail before creating recurring automation.

Do not schedule a workflow until it has passed at least one manual run with acceptable output.

For automated editing, do not promise boutique creative quality. Position the workflow as scalable production, not premium original filmmaking. Do not use unrelated material to force a complete timeline. Keep human review before publishing.

For HyperFrames, do not promise it can cover media workflows that depend mainly on generated character performance or image-to-video shots. It is strongest when the video can be represented as browser-renderable scenes, motion graphics, captions, charts, screenshots, and interface simulations. Always keep preview validation before final render.

## Audit

- Distillation date: 2026-07-07
- Source titles: 5分钟入门Codex，一个工作流在抖音赚了5W+; Codex自动化剪辑从0到1，开源我在抖音赚了5W+的剪辑工作流【万字长文】; Codex + HyperFrames 自动剪辑视频：深度技术解析与工程化最佳实践
- Source authors: xilo2991; GeekCatX
- Verification: V1 cross-domain examples present / V2 predicts new workflow setup tasks, automated editing runs, and HyperFrames rendering pipelines / V3 specific to Codex project, Skill, automation, Jianying/CapCut draft usage, and deterministic HTML video rendering
