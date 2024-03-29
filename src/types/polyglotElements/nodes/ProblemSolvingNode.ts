import ProblemSolvingNodeProperties from '../../../components/Properties/Nodes/ProblemSolvingNodeProperties';
import { ReactFlowProblemSolvingNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/searchActivity_icon.png';
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
  link: string;
  uploadLearner: boolean;
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
    link: '',
    uploadLearner: false,
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const oldData = node as ProblemSolvingNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: oldData.data?.text,
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
