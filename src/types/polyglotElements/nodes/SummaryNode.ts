import SummaryNodeProperties from '../../../components/Properties/Nodes/SummaryNodeProperties';
import { ReactFlowSummaryNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type SummaryNodeData = NodeData & {
  text: string;
};

export type SummaryNode = PolyglotNode & {
  type: 'SummaryNode';
  data: SummaryNodeData;
};

polyglotNodeComponentMapping.registerMapping<SummaryNode>({
  elementType: 'SummaryNode',
  name: 'Summary',
  icon: icon.src,
  group: 'understand_learning',
  propertiesComponent: SummaryNodeProperties,
  elementComponent: ReactFlowSummaryNode,
  defaultData: {
    text: '',
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const SummaryNode = node as SummaryNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: SummaryNode.data?.text,
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
