import SimulationNodeProperties from '../../../components/Properties/Nodes/SimulationNodeProperties';
import { ReactFlowSimulationNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/closeQuestion_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type SimulationNodeData = NodeData & {
  question: string;
  correctAnswers: string[];
};

export type SimulationNode = PolyglotNode & {
  type: 'SimulationNode';
  data: SimulationNodeData;
};

polyglotNodeComponentMapping.registerMapping<SimulationNode>({
  elementType: 'SimulationNode',
  name: 'Simulation',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: SimulationNodeProperties,
  elementComponent: ReactFlowSimulationNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    correctAnswers: [''],
  },
});
