import TrueFalseNodeProperties from '../../../components/Properties/Nodes/TrueFalseNodeProperties';
import { ReactFlowTrueFalseNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/trueFalse_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type TrueFalseNodeData = NodeData & {
  instructions: string;
  questions: string[];
  isQuestionCorrect: boolean[];
  negativePoints: number;
  positvePoints: number;
};

export type TrueFalseNode = PolyglotNode & {
  type: 'TrueFalseNode';
  data: TrueFalseNodeData;
};

polyglotNodeComponentMapping.registerMapping<TrueFalseNode>({
  elementType: 'TrueFalseNode',
  name: 'True/False',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: TrueFalseNodeProperties,
  elementComponent: ReactFlowTrueFalseNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    questions: [],
    isQuestionCorrect: [],
    negativePoints: 0,
    positvePoints: 1,
    instructions: '',
  },
});
