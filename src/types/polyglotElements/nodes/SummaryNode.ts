import SummaryNodeProperties from '../../../components/Properties/Nodes/SummaryNodeProperties';
import { ReactFlowSummaryNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/summary_CasesEvaluation_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type SummaryNodeData = NodeData & {
  text: string;
  link: string;
  uploadLearner: boolean;
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
    link: '',
    uploadLearner: false,
    ...defaultPolyglotNodeData,
  },
});
