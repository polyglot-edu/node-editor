import CalculationNodeProperties from '../../../components/Properties/Nodes/CalculationNodeProperties';
import { ReactFlowCalculationNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/Calculation_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CalculationNodeData = NodeData & {
  question: string;
  correctAnswers: string[];
};

export type CalculationNode = PolyglotNode & {
  type: 'CalculationNode';
  data: CalculationNodeData;
};

polyglotNodeComponentMapping.registerMapping<CalculationNode>({
  elementType: 'CalculationNode',
  name: 'Calculation',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: CalculationNodeProperties,
  elementComponent: ReactFlowCalculationNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    correctAnswers: [''],
  },
});
