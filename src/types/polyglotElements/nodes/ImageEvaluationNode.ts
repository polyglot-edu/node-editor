import ImageEvaluationNodeProperties from '../../../components/Properties/Nodes/ImageEvaluationNodeProperties';
import { ReactFlowImageEvaluationNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/evaluationActivity_icon.png';
import { zip } from '../../../utils/utils';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type ImageEvaluationNodeData = NodeData & {
  link: string;
  question: string;
  answers: string[];
  isAnswerCorrect: boolean[];
};

export type ImageEvaluationNode = PolyglotNode & {
  type: 'ImageEvaluationNode';
  data: ImageEvaluationNodeData;
};

polyglotNodeComponentMapping.registerMapping<ImageEvaluationNode>({
  elementType: 'ImageEvaluationNode',
  name: 'Image Evaluation',
  icon: icon.src,
  group: 'apply_assessment',
  propertiesComponent: ImageEvaluationNodeProperties,
  elementComponent: ReactFlowImageEvaluationNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    link: '',
    answers: [],
    isAnswerCorrect: [],
    question: '',
  },
});
