# Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the repository from a documented video-workflow Skill into a compact, runnable and verifiable production-Skill reference implementation.

**Architecture:** Keep `SKILL.md` as the concise decision and execution entry point; move detailed historical workflow material into one-level `references/` files. Add a self-contained Remotion starter that renders a short vertical demo from structured data, checks the produced files, and is exercised by GitHub Actions. Add repository governance and local repository checks so the public project is reusable and testable outside the author's machine.

**Tech Stack:** Markdown, Bash, Node.js, TypeScript, React, Remotion, GitHub Actions.

## Global Constraints

- Preserve all existing production knowledge, content boundaries, and Seedance-generated-asset safeguards.
- Use one locked `style_preset` in the runnable sample: `minimal`.
- The sample renders an honest, data-driven 9:16 MP4 and still frame; it must not claim externally generated assets or footage.
- Keep `SKILL.md` below 500 lines and link all moved detail directly from it.
- The CI workflow must be self-contained and must not depend on `$HOME/.codex` paths.
- All work follows RED → GREEN → REFACTOR and is verified before commit/push.

---

## File Map

| Path | Responsibility |
| --- | --- |
| `SKILL.md` | Concise triggering, workflow execution, production gates, and links to detailed references. |
| `references/workflow-patterns.md` | Historical application examples and detailed workflow route guidance moved from `SKILL.md`. |
| `references/video-workflows.md` | Detailed Jianying/CapCut and HyperFrames procedures moved from `SKILL.md`. |
| `examples/remotion-starter/` | Runnable portrait Remotion sample, its source data, verification command, and short usage guide. |
| `tests/repository-contract/check-repository.sh` | Portable repository completeness regression checks. |
| `.github/workflows/verify.yml` | CI: static checks, typecheck, still render, MP4 smoke render, artifact verification. |
| `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md` | Open-source reuse, contributor expectations, and release record. |
| `README.md` | Accurate feature, runnable sample, validation, and governance documentation. |

### Task 1: Establish the production-readiness regression contract

**Files:**
- Create: `tests/repository-contract/check-repository.sh`
- Modify: `tests/production-skill-contract/focused-check.sh`

**Interfaces:**
- Consumes: repository root as the script's parent directory.
- Produces: exit `0` only when governance, starter source, CI, and main-Skill reference boundaries exist.

- [ ] **Step 1: Write the failing test**

Create `tests/repository-contract/check-repository.sh` with required paths `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`, `.github/workflows/verify.yml`, `examples/remotion-starter/package.json`, `examples/remotion-starter/src/index.ts`, `examples/remotion-starter/src/Root.tsx`, `examples/remotion-starter/src/WorkflowStarter.tsx`, `references/workflow-patterns.md`, and `references/video-workflows.md`; require `SKILL.md` to cite both reference files and contain fewer than 500 lines.

- [ ] **Step 2: Run test to verify it fails**

Run: `bash tests/repository-contract/check-repository.sh`

Expected: FAIL because the required files and references do not yet exist.

- [ ] **Step 3: Wire the existing focused suite**

Append a call to `tests/repository-contract/check-repository.sh` in `tests/production-skill-contract/focused-check.sh` after its existing checks so the established focused suite detects production-readiness regressions.

- [ ] **Step 4: Re-run the focused suite**

Run: `bash tests/production-skill-contract/focused-check.sh`

Expected: FAIL because the new completeness contract is intentionally unmet.

### Task 2: Add the runnable Remotion starter and artifact verifier

**Files:**
- Create: `examples/remotion-starter/package.json`
- Create: `examples/remotion-starter/tsconfig.json`
- Create: `examples/remotion-starter/remotion.config.ts`
- Create: `examples/remotion-starter/src/index.ts`
- Create: `examples/remotion-starter/src/Root.tsx`
- Create: `examples/remotion-starter/src/WorkflowStarter.tsx`
- Create: `examples/remotion-starter/src/sample-data.ts`
- Create: `examples/remotion-starter/scripts/verify-artifacts.mjs`
- Create: `examples/remotion-starter/README.md`
- Create: `examples/remotion-starter/.gitignore`

**Interfaces:**
- `VideoData` is a JSON-like object with `title`, `hook`, `proof`, `cta`, and `stylePreset: 'minimal'`.
- The `WorkflowStarter` composition uses `VideoData` props and renders a 1080×1920, 30fps, 2-second vertical sequence.
- `verify-artifacts.mjs` receives `--still <path> --video <path>` and rejects missing or empty files and incorrect PNG/MP4 signatures.

- [ ] **Step 1: Write failing artifact expectations**

Extend `tests/repository-contract/check-repository.sh` to require scripts named `typecheck`, `render:still`, `render:smoke`, and `verify:artifacts` in the starter package and source text that registers a composition with `id="WorkflowStarter"`.

- [ ] **Step 2: Run test to verify it fails**

Run: `bash tests/repository-contract/check-repository.sh`

Expected: FAIL because the starter project is absent.

- [ ] **Step 3: Implement the smallest real video project**

Use a pinned Remotion dependency set compatible with Node 20. Register a 1080×1920, 30fps, 60-frame composition. Render a clean, minimal four-beat video with safe typography and no external assets. Add scripts for type checking, one still, a short H.264 MP4, and binary-signature verification.

- [ ] **Step 4: Install and render the production path**

Run: `npm install` in `examples/remotion-starter`, then `npm run typecheck`, `npm run render:still`, `npm run render:smoke`, and `npm run verify:artifacts`.

Expected: typecheck succeeds; a non-empty PNG and MP4 exist in `examples/remotion-starter/outputs/`.

- [ ] **Step 5: Commit the useful sample outputs**

Commit the small preview PNG and MP4 only if the combined size is under 2 MB; otherwise commit the preview PNG and retain the validated MP4 as a CI artifact. Document the exact distinction.

### Task 3: Split the Skill without losing production knowledge

**Files:**
- Modify: `SKILL.md`
- Create: `references/workflow-patterns.md`
- Create: `references/video-workflows.md`
- Modify: `references/README.md`
- Modify: `test-prompts.json`

**Interfaces:**
- `SKILL.md` retains all triggering, contract, configuration, style-lock, production-sequence, environment bootstrap summary, quality gates, packaging, and boundaries.
- The moved references retain detailed workflow instructions and are linked directly under an explicit “read when” condition.

- [ ] **Step 1: Tighten the red contract**

Require the two new reference links in `tests/repository-contract/check-repository.sh` and run it. It must still fail before the files and lean Skill are implemented.

- [ ] **Step 2: Move only detailed material**

Move the source-article application narratives and expanded Jianying/CapCut and HyperFrames operational procedures into the two new references. Retain one-paragraph route selection and an explicit detailed-reference link in `SKILL.md`.

- [ ] **Step 3: Preserve discoverability and update tests**

Update `references/README.md` and `test-prompts.json` with a runnable-Remotion trigger and a negative case that a composition alone is not a rendered MP4. Keep all existing positive, negative, and edge cases.

- [ ] **Step 4: Run static validation**

Run: `python3 "$HOME/.codex/skills/.system/skill-creator/scripts/quick_validate.py" .`, `jq empty test-prompts.json`, `bash tests/repository-contract/check-repository.sh`, and `bash tests/production-skill-contract/focused-check.sh`.

Expected: all commands succeed.

### Task 4: Add CI and contributor-facing repository governance

**Files:**
- Create: `.github/workflows/verify.yml`
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`
- Create: `CHANGELOG.md`
- Modify: `README.md`

**Interfaces:**
- CI runs on pull requests, pushes to `main`, and manual dispatch.
- CI performs local static checks, `npm ci` inside the starter, typechecking, still render, MP4 smoke render, artifact verification, and stores outputs as a short-lived workflow artifact.
- MIT licensing applies to repository-authored materials; third-party source attributions remain in documentation.

- [ ] **Step 1: Run the regression contract before governance files exist**

Run: `bash tests/repository-contract/check-repository.sh`

Expected: FAIL for the missing CI/governance paths.

- [ ] **Step 2: Add the minimal governance documents**

Add MIT with `Copyright (c) 2026 jackbauerxu`; document concise contribution steps and version `0.5.0` changes, including the runnable starter and CI.

- [ ] **Step 3: Add portable CI**

Create a Node 20 GitHub Actions workflow with checkout, setup-node cache scoped to `examples/remotion-starter/package-lock.json`, static checks, `npm ci`, typecheck, still/MP4 render, artifact verification, and output upload.

- [ ] **Step 4: Make README claims exact**

Update the production-system tree, reference-assets/few-shot sections, quick-start, validation commands, license section, and file map. Clearly distinguish checked-in preview evidence, generated CI artifacts, and final videos produced in a user project.

- [ ] **Step 5: Run the repository suite**

Run: `bash tests/repository-contract/check-repository.sh` and `bash tests/production-skill-contract/focused-check.sh`.

Expected: PASS.

### Task 5: Verify, commit, and publish

**Files:** all changed files from Tasks 1–4.

- [ ] **Step 1: Run complete local verification**

Run: `git diff --check`; the Skill validator; JSON validation; both shell contracts; `npm run typecheck`; `npm run render:still`; `npm run render:smoke`; `npm run verify:artifacts`; and `git status --short`.

Expected: no whitespace errors; all checks exit `0`; only intended files are changed.

- [ ] **Step 2: Inspect the staged diff**

Run: `git diff --stat` and `git diff --check` before staging; verify that no third-party visuals, secrets, node_modules, or false render claims are included.

- [ ] **Step 3: Commit and push**

Commit with `feat: add runnable video production reference` and push the current branch to `origin`.

- [ ] **Step 4: Verify the remote state**

Run: `git ls-remote origin refs/heads/main` and compare it to `git rev-parse HEAD`.

Expected: hashes match.

## Plan Self-Review

- **Spec coverage:** Tasks 1–2 supply executable code and render evidence; Task 3 preserves and makes production knowledge loadable; Task 4 adds CI, license, change log, contribution path, and accurate docs; Task 5 supplies fresh local and remote verification.
- **No placeholders:** all task paths, command names, expected outcomes, interfaces, and governing constraints are specified.
- **Boundary consistency:** the starter owns its code/output checks, repository contracts own static completeness, and CI only invokes portable repository-local commands.

## Execution Mode

The user requested implementation now. Execute inline in this session; do not delegate tasks.
