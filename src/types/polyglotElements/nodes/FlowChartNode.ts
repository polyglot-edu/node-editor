import FlowChartNodeProperties from '../../../components/Properties/Nodes/FlowChartNodeProperties';
import { ReactFlowFlowChartNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/closeQuestion_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type FlowChartNodeData = NodeData & {
  question: string;
  correctAnswers: string[];
};

export type FlowChartNode = PolyglotNode & {
  type: 'FlowChartNode';
  data: FlowChartNodeData;
};

polyglotNodeComponentMapping.registerMapping<FlowChartNode>({
  elementType: 'FlowChartNode',
  name: 'Flow Chart',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: FlowChartNodeProperties,
  elementComponent: ReactFlowFlowChartNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    correctAnswers: [''],
  },
});
