export type VideoData = {
  title: string;
  hook: string;
  proof: string;
  system: string;
  cta: string;
  stylePreset: 'minimal';
};

export const sampleVideo: VideoData = {
  title: '把重复工作\n变成生产线',
  hook: '不是多做一次，而是让下一次不必从零开始。',
  proof: '明确输入、输出、检查点，才能稳定复用。',
  system: 'Skill 管流程，Remotion 管可复现渲染。',
  cta: '先跑通一个样例，再把它变成你的模板。',
  stylePreset: 'minimal'
};
