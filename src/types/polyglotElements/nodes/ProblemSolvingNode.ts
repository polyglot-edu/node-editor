import ProblemSolvingNodeProperties from '../../../components/Properties/Nodes/ProblemSolvingNodeProperties';
import { ReactFlowProblemSolvingNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type ProblemSolvingNodeData = NodeData & {
  text: string;
};

export type ProblemSolvingNode = PolyglotNode & {
  type: 'ProblemSolvingNode';
  data: ProblemSolvingNodeData;
};

polyglotNodeComponentMapping.registerMapping<ProblemSolvingNode>({
  elementType: 'ProblemSolvingNode',
  name: 'Problem Solving',
  icon: icon.src,
  group: 'apply_learning',
  propertiesComponent: ProblemSolvingNodeProperties,
  elementComponent: ReactFlowProblemSolvingNode,
  defaultData: {
    text: '',
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const ProblemSolvingNode = node as ProblemSolvingNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: ProblemSolvingNode.data?.text,
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
