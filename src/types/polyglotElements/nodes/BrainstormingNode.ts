import BrainstormingBrainstormingNodeProperties from '../../../components/Properties/Nodes/BrainstormingNodeProperties';
import { ReactFlowBrainstormingNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/Brainstorming_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type BrainstormingNodeData = NodeData & {
  question: string;
  correctAnswers: string[];
};

export type BrainstormingNode = PolyglotNode & {
  type: 'BrainstormingNode';
  data: BrainstormingNodeData;
};

polyglotNodeComponentMapping.registerMapping<BrainstormingNode>({
  elementType: 'BrainstormingNode',
  name: 'Brainstorming',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: BrainstormingNodeProperties,
  elementComponent: ReactFlowBrainstormingNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    correctAnswers: [''],
  },
});
