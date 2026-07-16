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
require_file prompts/tiktok.md
require_file prompts/ai-demo.md
require_file prompts/product.md
require_file prompts/news.md
require_file prompts/b-roll.md
require_file prompts/unboxing.md
require_file styles/apple.md
require_file styles/tesla.md
require_file styles/bloomberg.md
require_file styles/cyberpunk.md
require_file styles/minimal.md
require_file references/design-language.md
require_file references/shot-library.md
require_file references/motion-examples.md
require_file references/images/vertical-safe-area.svg
require_file references/storyboards/ai-demo-9x16.svg
require_file references/storyboards/news-brief-9x16.svg
require_file references/videos/README.md
require_file examples/ai-demo.md
require_file examples/product-launch.md
require_file examples/news-brief.md
require_file examples/ai-demo-final-frame.svg
require_file remotion/production-contract.md

# Production behavior: lane + preset lock + reference lookup + quality gate.
require_text SKILL.md 'Production Configuration'
require_text SKILL.md 'Style Lock'
require_text SKILL.md 'Shot Library'
require_text SKILL.md 'Few-shot examples'
require_text SKILL.md 'No generic-style override'
require_text SKILL.md 'first preview is a candidate'
require_text README.md 'Production System'
require_text README.md 'Reference Assets'
require_text README.md 'Few-shot Examples'
forbid_file scripts/stock-analysis.md
forbid_file prompts/stock-analysis.md
forbid_file examples/stock-analysis.md
forbid_text SKILL.md 'stock-analysis'
forbid_text README.md '股票'
forbid_text remotion/production-contract.md 'stock-analysis'
forbid_text test-prompts.json '股票'
forbid_text tests/production-skill-contract/contract-cases.json 'stock-analysis'

printf '40/40 production-skill contract checks passed\n'
