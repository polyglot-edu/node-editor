import CasesEvaluationNodeProperties from '../../../components/Properties/Nodes/CasesEvaluationNodeProperties';
import { ReactFlowCasesEvaluationNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/summary_CasesEvaluation_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CasesEvaluationNodeData = NodeData & {
  guidelines: string;
  text: string;
  link: string;
  uploadLearner: boolean;
};

export type CasesEvaluationNode = PolyglotNode & {
  type: 'CasesEvaluationNode';
  data: CasesEvaluationNodeData;
};

polyglotNodeComponentMapping.registerMapping<CasesEvaluationNode>({
  elementType: 'CasesEvaluationNode',
  name: 'Cases Evaluation',
  icon: icon.src,
  group: 'understand_assessment',
  propertiesComponent: CasesEvaluationNodeProperties,
  elementComponent: ReactFlowCasesEvaluationNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    guidelines: '',
    text: '',
    link: '',
    uploadLearner: false,
  },
});
