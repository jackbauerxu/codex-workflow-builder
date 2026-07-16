#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
require_file() { test -s "$root/$1"; }
require_text() { rg -q --fixed-strings "$2" "$root/$1"; }
forbid_file() { test ! -e "$root/$1"; }
forbid_text() { ! rg -q --fixed-strings "$2" "$root/$1"; }

# Production knowledge: actual reusable files, not a README-only promise.
require_file scripts/opening.md
require_file scripts/storytelling.md
require_file scripts/outro.md
require_file scripts/captions.md
require_file scripts/README.md
require_file scripts/ai-demo.md
require_file scripts/product-launch.md
require_file scripts/unboxing.md
require_file scripts/news-explainer.md
require_file scripts/tiktok-shorts.md
require_file scripts/b-roll-sequence.md
require_file scripts/how-to-tutorial.md
require_file scripts/case-study.md
require_file scripts/comparison-decision.md
require_file scripts/trend-commentary.md
require_file prompts/tiktok.md
require_file prompts/ai-demo.md
require_file prompts/product.md
require_file prompts/news.md
require_file prompts/b-roll.md
require_file prompts/unboxing.md
require_file prompts/generative-video.md
require_file styles/apple.md
require_file styles/tesla.md
require_file styles/bloomberg.md
require_file styles/cyberpunk.md
require_file styles/minimal.md
require_file references/design-language.md
require_file references/shot-library.md
require_file references/motion-examples.md
require_file references/generative-video-production.md
require_file references/images/vertical-safe-area.svg
require_file references/storyboards/ai-demo-9x16.svg
require_file references/storyboards/news-brief-9x16.svg
require_file references/videos/README.md
require_file examples/ai-demo.md
require_file examples/product-launch.md
require_file examples/news-brief.md
require_file examples/generative-video-sequence.md
require_file examples/ai-demo-final-frame.svg
require_file remotion/production-contract.md

# Production behavior: open content format + preset lock + reference lookup + quality gate.
require_text SKILL.md 'Production Configuration'
require_text SKILL.md 'Script Library'
require_text SKILL.md 'Generative-video asset route'
require_text SKILL.md 'Source Identity'
require_text SKILL.md 'Continuity Ledger'
require_text SKILL.md 'realistic-video-prompting'
require_text SKILL.md 'not a closed taxonomy'
require_text SKILL.md 'custom beat map'
require_text SKILL.md 'Style Lock'
require_text SKILL.md 'Shot Library'
require_text SKILL.md 'Few-shot examples'
require_text SKILL.md 'No generic-style override'
require_text SKILL.md 'first preview is a candidate'
require_text README.md 'Production System'
require_text README.md 'Seedance'
require_text references/README.md 'generative-video-production.md'
require_text agents/openai.yaml 'generated asset'
require_text README.md '不是封闭范围'
require_text README.md 'Reference Assets'
require_text README.md 'Few-shot Examples'
require_text remotion/production-contract.md 'content_format'
require_text remotion/production-contract.md 'generated_visuals'
require_text prompts/generative-video.md 'seven sections'
require_text references/generative-video-production.md 'Prompt QA Gate'
require_text references/generative-video-production.md 'not evidence of a render'
forbid_file scripts/stock-analysis.md
forbid_file prompts/stock-analysis.md
forbid_file examples/stock-analysis.md
forbid_text SKILL.md 'stock-analysis'
forbid_text SKILL.md 'lane:'
forbid_text README.md '股票'
forbid_text remotion/production-contract.md 'stock-analysis'
forbid_text test-prompts.json '股票'
forbid_text tests/production-skill-contract/contract-cases.json 'stock-analysis'

printf 'production-skill contract checks passed\n'
