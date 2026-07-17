# Runnable Remotion Starter

This is a small, self-contained proof that the production contract can become a real vertical video. It renders a 2-second, 1080×1920 `minimal` sequence from typed content data—no footage, generated assets, or unverified claims are involved.

## Run it

```bash
npm ci
npm run typecheck
npm run render:still
npm run render:smoke
npm run verify:artifacts
```

The commands create:

- `outputs/first-frame.png`: an inspectable frame-zero layout check.
- `outputs/workflow-starter.mp4`: a short H.264 render.

`verify:artifacts` checks that both files exist, are non-empty, and carry the expected PNG/MP4 signatures. This example is intentionally small; a production project should replace `sample-data.ts`, extend the composition, and keep the parent Skill's production configuration, fact manifest, asset rights, and QA gates.
