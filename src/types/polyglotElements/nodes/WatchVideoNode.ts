import WatchVideoNodeProperties from '../../../components/Properties/Nodes/WatchVideoNodeProperties';
import { ReactFlowWatchVideoNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type WatchVideoNodeData = NodeData & {
  text: string;
};

export type WatchVideoNode = PolyglotNode & {
  type: 'WatchVideoNode';
  data: WatchVideoNodeData;
};

polyglotNodeComponentMapping.registerMapping<WatchVideoNode>({
  elementType: 'WatchVideoNode',
  name: 'Lesson (Watch Video)',
  icon: icon.src,
  group: 'remember_learning',
  propertiesComponent: WatchVideoNodeProperties,
  elementComponent: ReactFlowWatchVideoNode,
  defaultData: {
    text: '',
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const WatchVideoNode = node as WatchVideoNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: WatchVideoNode.data?.text,
      },
    ];

    return {
      ...node,
      runtimeData: {
        challengeSetup,
        challengeContent,
      },
    };
  },
});
