import { CloseEndedQuestionNodeProperties } from '../../../components/NodeProperties';
import { ReactFlowCloseEndedQuestionNode } from '../../../components/ReactFlowNode';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CloseEndedQuestionNodeData = NodeData & {
  question: string;
  correctAnswers: string[];
};

export type CloseEndedQuestionNode = PolyglotNode & {
  type: 'CloseEndedQuestionNode';
  data: CloseEndedQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<CloseEndedQuestionNode>({
  elementType: 'CloseEndedQuestionNode',
  name: 'Close Ended Question',
  propertiesComponent: CloseEndedQuestionNodeProperties,
  elementComponent: ReactFlowCloseEndedQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    correctAnswers: [''],
  },
});
