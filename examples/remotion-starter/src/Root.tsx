import {Composition} from 'remotion';
import {sampleVideo} from './sample-data';
import {WorkflowStarter} from './WorkflowStarter';

export const Root = () => {
  return (
    <Composition
      id="WorkflowStarter"
      component={WorkflowStarter}
      defaultProps={sampleVideo}
      durationInFrames={60}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
