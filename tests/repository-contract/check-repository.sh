#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"

require_file() { test -s "$root/$1"; }
require_text() { rg -q --fixed-strings "$2" "$root/$1"; }

for path in \
  LICENSE \
  CONTRIBUTING.md \
  CHANGELOG.md \
  .github/workflows/verify.yml \
  references/workflow-patterns.md \
  references/video-workflows.md \
  examples/remotion-starter/package.json \
  examples/remotion-starter/src/index.ts \
  examples/remotion-starter/src/Root.tsx \
  examples/remotion-starter/src/WorkflowStarter.tsx \
  examples/remotion-starter/scripts/verify-artifacts.mjs \
  tests/repository-contract/check-skill-metadata.mjs; do
  require_file "$path"
done

require_text SKILL.md 'references/workflow-patterns.md'
require_text SKILL.md 'references/video-workflows.md'
require_text examples/remotion-starter/package.json '"typecheck"'
require_text examples/remotion-starter/package.json '"render:still"'
require_text examples/remotion-starter/package.json '"render:smoke"'
require_text examples/remotion-starter/package.json '"verify:artifacts"'
require_text examples/remotion-starter/src/Root.tsx 'id="WorkflowStarter"'
node "$root/tests/repository-contract/check-skill-metadata.mjs"

line_count="$(wc -l < "$root/SKILL.md" | tr -d ' ')"
test "$line_count" -lt 500

printf 'repository contract checks passed\n'
