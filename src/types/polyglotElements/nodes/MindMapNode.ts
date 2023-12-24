import MindMapNodeProperties from '../../../components/Properties/Nodes/MindMapNodeProperties';
import { ReactFlowMindMapNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/mindMap_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type MindMapNodeData = NodeData & {
  text: string;
  link: string;
  uploadLearner: boolean;
};

export type MindMapNode = PolyglotNode & {
  type: 'MindMapNode';
  data: MindMapNodeData;
};

polyglotNodeComponentMapping.registerMapping<MindMapNode>({
  elementType: 'MindMapNode',
  name: 'MindMap',
  icon: icon.src,
  group: 'understand_learning',
  propertiesComponent: MindMapNodeProperties,
  elementComponent: ReactFlowMindMapNode,
  defaultData: {
    text: '',
    link: '',
    uploadLearner: false,
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const oldData = node as MindMapNode;

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
