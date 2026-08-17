#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"

if ! command -v ffmpeg >/dev/null 2>&1 || ! command -v ffprobe >/dev/null 2>&1; then
  printf 'This check requires ffmpeg and ffprobe on PATH.\n'
  printf 'macOS: brew install ffmpeg\n'
  printf 'Ubuntu: sudo apt-get update && sudo apt-get install -y ffmpeg\n'
  exit 2
fi

tmp="$(mktemp -d "${TMPDIR:-/tmp}/mp4-edit-check.XXXXXX")"
trap 'rm -rf "$tmp"' EXIT

# Synthesize fixtures at runtime; never commit binary fixtures.
ffmpeg -y \
  -f lavfi -i "color=c=red:s=640x360:d=4:r=25" \
  -f lavfi -i "color=c=blue:s=640x360:d=4:r=25" \
  -f lavfi -i "sine=frequency=440:sample_rate=44100:duration=8" \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v];[2:a]aformat=sample_rates=44100:channel_layouts=stereo[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$tmp/source.mp4"

ffmpeg -y -f lavfi -i "testsrc2=size=640x360:rate=25:duration=2" \
  -c:v libx264 -pix_fmt yuv420p -an "$tmp/endcard.mp4"

ffmpeg -y -f lavfi -i "sine=frequency=220:sample_rate=44100:duration=10" \
  -c:a pcm_s16le "$tmp/music.wav"

ffmpeg -y -ss 1 -i "$tmp/source.mp4" -frames:v 1 -q:v 2 "$tmp/still.png"

font_file=""
for fonts_dir in /System/Library/Fonts /Library/Fonts /usr/share/fonts; do
  if test -d "$fonts_dir"; then
    font_file="$(find "$fonts_dir" -type f \( -name '*.ttf' -o -name '*.otf' \) 2>/dev/null | head -n 1 || true)"
    if test -n "$font_file"; then
      break
    fi
  fi
done

if test -n "$font_file"; then
  printf 'Using font: %s\n' "$font_file"
else
  printf 'SKIP font-case\n'
fi

pass_count=0
fail_count=0

case_pass() {
  printf 'CASE %s PASS\n' "$1"
  pass_count=$((pass_count + 1))
}

case_fail() {
  printf 'CASE %s FAIL %s\n' "$1" "$2"
  fail_count=$((fail_count + 1))
}

# CASE 1: probe must identify at least one scene cut.
if node "$root/tools/probe-media.mjs" "$tmp/source.mp4" --out "$tmp/probe.json" >"$tmp/probe-case1.out" 2>&1; then
  scene_count="$(python3 - "$tmp/probe.json" <<'PY' || true
import json, sys
try:
    with open(sys.argv[1], encoding='utf-8') as f:
        data = json.load(f)
    cuts = data.get('scene_cuts', [])
    print(len(cuts) if isinstance(cuts, list) else 0)
except Exception:
    print(0)
PY
)"
  if test "${scene_count:-0}" -ge 1; then
    case_pass 1
  else
    case_fail 1 "scene_cuts array length is ${scene_count:-0}, expected >= 1"
  fi
else
  case_fail 1 "probe-media exited non-zero"
fi

# Build a manifest from the probe result; fall back to the known red/blue cut point.
python3 - "$tmp/probe.json" "$font_file" "$tmp/manifest-happy.json" "$tmp/source.mp4" "$tmp/output-happy.mp4" "$tmp/endcard.mp4" "$tmp/music.wav" <<'PY'
import json, sys

probe_path, font, manifest_path, source_video, output_video, endcard_video, music_file = sys.argv[1:8]

try:
    with open(probe_path, encoding='utf-8') as f:
        probe = json.load(f)
    cut_points = [float(x) for x in probe.get('scene_cuts', []) if isinstance(x, (int, float))]
except Exception:
    cut_points = []

if not cut_points:
    cut_points = [4.0]

end_card = {"video": endcard_video, "text_fade_in": 0.5}
if font:
    end_card["text"] = "向世界出发"
    end_card["font_file"] = font

requirements = [
    {
        "id": "R1",
        "description": "在场景切点添加转场",
        "status": "planned",
        "evidence": "",
        "assets": []
    },
    {
        "id": "R2",
        "description": "对全片做暖色调色",
        "status": "planned",
        "evidence": "",
        "assets": []
    },
    {
        "id": "R3",
        "description": "配上一段感人的背景音乐",
        "status": "planned",
        "evidence": "",
        "assets": [music_file]
    },
    {
        "id": "R4",
        "description": "添加动态数字人片尾并叠加文字",
        "status": "planned",
        "evidence": "",
        "assets": [endcard_video]
    },
    {
        "id": "R5",
        "description": "导出最终成片",
        "status": "planned",
        "evidence": "",
        "assets": []
    }
]

manifest = {
    "source_video": source_video,
    "output_video": output_video,
    "requirements": requirements,
    "edit_plan": {
        "source": source_video,
        "output": output_video,
        "transitions": {"enabled": True, "duration": 0.4, "cut_points": cut_points},
        "color": {"preset": "warm"},
        "music": {"file": music_file, "fade_in": 1.0, "fade_out": 2.0, "duck_db": -12.0},
        "end_card": end_card
    }
}

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
PY

cp "$tmp/manifest-happy.json" "$tmp/manifest-render-template.json"

# CASE 2: full happy path.
if ! test -f "$tmp/manifest-happy.json"; then
  case_fail 2 "failed to write manifest-happy.json"
elif ! node "$root/tools/render-existing-mp4.mjs" "$tmp/manifest-happy.json" >"$tmp/render-happy.out" 2>&1; then
  render_status=$?
  cat "$tmp/render-happy.out" >&2
  case_fail 2 "render exited $render_status"
elif ! python3 - "$tmp/manifest-happy.json" <<'PY'
import json, sys
path = sys.argv[1]
with open(path, encoding='utf-8') as f:
    manifest = json.load(f)
for item in manifest['requirements']:
    item['status'] = 'implemented'
    item['evidence'] = 'case2 render: output exists, sha256 differs, ffprobe duration/audio checked'
with open(path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
PY
then
  case_fail 2 "failed to mark requirements implemented"
elif ! node "$root/tools/verify-delivery.mjs" "$tmp/manifest-happy.json" >"$tmp/verify-happy.out" 2>&1; then
  verify_status=$?
  cat "$tmp/verify-happy.out" >&2
  case_fail 2 "verify exited $verify_status"
else
  src_dur="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$tmp/source.mp4" 2>/dev/null || true)"
  out_dur="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$tmp/output-happy.mp4" 2>/dev/null || true)"
  audio_stream="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of default=noprint_wrappers=1:nokey=1 "$tmp/output-happy.mp4" 2>/dev/null || true)"
  if awk -v s="$src_dur" -v o="$out_dur" -v a="$audio_stream" 'BEGIN { exit !(o > s && a == "audio") }'; then
    case_pass 2
  else
    case_fail 2 "expected output duration > $src_dur and an audio stream, got $out_dur / $audio_stream"
  fi
fi

# CASE 3: missing music file must refuse rendering and name the path.
missing_music="$tmp/no-such-music.wav"
if ! python3 - "$tmp/manifest-render-template.json" "$tmp/manifest-missing-music.json" "$missing_music" "$tmp/output-missing.mp4" <<'PY'
import json, sys
src, dst, missing, out = sys.argv[1:5]
with open(src, encoding='utf-8') as f:
    manifest = json.load(f)
manifest['output_video'] = out
manifest['edit_plan']['output'] = out
manifest['edit_plan']['music']['file'] = missing
with open(dst, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
PY
then
  case_fail 3 "failed to write missing-music manifest"
elif node "$root/tools/render-existing-mp4.mjs" "$tmp/manifest-missing-music.json" >"$tmp/render-missing.out" 2>&1; then
  case_fail 3 "render unexpectedly succeeded with missing music"
else
  status=$?
  if grep -qF -- 'no-such-music.wav' "$tmp/render-missing.out"; then
    case_pass 3
  else
    case_fail 3 "render rejected (exit $status) but output did not mention $missing_music"
  fi
fi

# CASE 4: static-image end card must refuse rendering.
if ! python3 - "$tmp/manifest-render-template.json" "$tmp/manifest-static-endcard.json" "$tmp/still.png" "$tmp/output-static.mp4" <<'PY'
import json, sys
src, dst, still, out = sys.argv[1:5]
with open(src, encoding='utf-8') as f:
    manifest = json.load(f)
manifest['output_video'] = out
manifest['edit_plan']['output'] = out
manifest['edit_plan']['end_card']['video'] = still
with open(dst, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
PY
then
  case_fail 4 "failed to write static-endcard manifest"
elif node "$root/tools/render-existing-mp4.mjs" "$tmp/manifest-static-endcard.json" >"$tmp/render-static.out" 2>&1; then
  case_fail 4 "render unexpectedly succeeded with a static image end card"
else
  case_pass 4
fi

# CASE 5: a lingering planned requirement must fail delivery verification.
if ! python3 - "$tmp/manifest-happy.json" "$tmp/manifest-verify-planned.json" <<'PY'
import json, sys
src, dst = sys.argv[1:3]
with open(src, encoding='utf-8') as f:
    manifest = json.load(f)
for item in manifest['requirements']:
    if item.get('id') == 'R1':
        item['status'] = 'planned'
        item['evidence'] = ''
        break
with open(dst, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
PY
then
  case_fail 5 "failed to write planned-requirement manifest"
elif node "$root/tools/verify-delivery.mjs" "$tmp/manifest-verify-planned.json" >"$tmp/verify-planned.out" 2>&1; then
  case_fail 5 "verify unexpectedly passed with a planned requirement"
else
  case_pass 5
fi

# CASE 6: bit-for-bit unchanged source must fail delivery verification.
cp "$tmp/source.mp4" "$tmp/output-unchanged.mp4"
if ! python3 - "$tmp/manifest-happy.json" "$tmp/manifest-verify-unchanged.json" "$tmp/source.mp4" "$tmp/output-unchanged.mp4" <<'PY'
import json, sys
src, dst, source_video, output_video = sys.argv[1:5]
with open(src, encoding='utf-8') as f:
    manifest = json.load(f)
manifest['source_video'] = source_video
manifest['output_video'] = output_video
manifest['edit_plan']['source'] = source_video
manifest['edit_plan']['output'] = output_video
with open(dst, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
PY
then
  case_fail 6 "failed to write unchanged-source manifest"
elif node "$root/tools/verify-delivery.mjs" "$tmp/manifest-verify-unchanged.json" >"$tmp/verify-unchanged.out" 2>&1; then
  case_fail 6 "verify unexpectedly passed with unchanged source copy"
else
  case_pass 6
fi

if test "$fail_count" -ne 0; then
  printf '%d of 6 cases passed, %d failed\n' "$pass_count" "$fail_count"
  exit 1
fi

printf 'existing-mp4-edit toolchain checks passed (%d/%d)\n' "$pass_count" "$fail_count"
