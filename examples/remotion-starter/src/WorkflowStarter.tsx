import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import type {VideoData} from './sample-data';

const beatStart = [0, 15, 30, 45] as const;

const appear = (frame: number, start: number) =>
  interpolate(frame, [start, start + 7], [0.82, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

const rise = (frame: number, start: number) =>
  interpolate(frame, [start, start + 9], [38, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

export const WorkflowStarter = ({title, hook, proof, system, cta}: VideoData) => {
  const frame = useCurrentFrame();
  const beat = Math.min(3, Math.floor(frame / 15));
  const copy = [hook, proof, system, cta][beat];
  const start = beatStart[beat];
  const copyOpacity = appear(frame, start);
  const headlineOpacity = appear(frame, 0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F6F3EC',
        color: '#171717',
        fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 560,
          height: 560,
          borderRadius: 999,
          backgroundColor: '#E06F51',
          opacity: 0.16,
          right: -200,
          top: 420 + Math.sin(frame / 12) * 18
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 76,
          right: 76,
          top: 106,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 27,
          fontWeight: 700,
          letterSpacing: 2
        }}
      >
        <span>WORKFLOW / 01</span>
        <span>{String(beat + 1).padStart(2, '0')} / 04</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 76,
          right: 76,
          top: 295,
          opacity: headlineOpacity,
          transform: `translateY(${rise(frame, 0)}px)`
        }}
      >
        <div style={{fontSize: 36, fontWeight: 700, color: '#E06F51', letterSpacing: 1}}>CODEX WORKFLOW BUILDER</div>
        <div style={{fontSize: 112, lineHeight: 1.04, fontWeight: 800, whiteSpace: 'pre-line', marginTop: 22}}>{title}</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 76,
          right: 76,
          bottom: 240,
          opacity: copyOpacity,
          transform: `translateY(${rise(frame, start)}px)`
        }}
      >
        <div style={{fontSize: 30, color: '#74706A', fontWeight: 700, marginBottom: 24}}>STEP {String(beat + 1).padStart(2, '0')}</div>
        <div style={{fontSize: 61, lineHeight: 1.28, fontWeight: 700, maxWidth: 850}}>{copy}</div>
      </div>

      <div style={{position: 'absolute', left: 76, right: 76, bottom: 104, height: 6, backgroundColor: '#D8D1C7'}}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, ((frame + 1) / 60) * 100)}%`,
            backgroundColor: '#171717'
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
