import FindSolutionNodeProperties from '../../../components/Properties/Nodes/FindSolutionNodeProperties';
import { ReactFlowFindSolutionNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/findSolution_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type FindSolutionNodeData = NodeData & {
  text: string;
  link: string;
  uploadLearner: boolean;
};

export type FindSolutionNode = PolyglotNode & {
  type: 'FindSolutionNode';
  data: FindSolutionNodeData;
};

polyglotNodeComponentMapping.registerMapping<FindSolutionNode>({
  elementType: 'FindSolutionNode',
  name: 'Find Solution',
  icon: icon.src,
  group: 'create_learning',
  propertiesComponent: FindSolutionNodeProperties,
  elementComponent: ReactFlowFindSolutionNode,
  defaultData: {
    text: '',
    link: '',
    uploadLearner: false,
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const FindSolutionNode = node as FindSolutionNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: FindSolutionNode.data?.text,
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
