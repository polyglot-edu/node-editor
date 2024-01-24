import AnalyzingPlottingDataNodeProperties from '../../../components/Properties/Nodes/AnalyzingPlottingDataNodeProperties';
import { ReactFlowAnalyzingPlottingDataNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/AnalyzingPlottingData_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type AnalyzingPlottingDataNodeData = NodeData & {
  question: string;
};

export type AnalyzingPlottingDataNode = PolyglotNode & {
  type: 'AnalyzingPlottingDataNode';
  data: AnalyzingPlottingDataNodeData;
};

polyglotNodeComponentMapping.registerMapping<AnalyzingPlottingDataNode>({
  elementType: 'AnalyzingPlottingDataNode',
  name: 'Analyzing and Plotting Data using code',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: AnalyzingPlottingDataNodeProperties,
  elementComponent: ReactFlowAnalyzingPlottingDataNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
  },
});
