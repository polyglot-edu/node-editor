import { CodingQuestionNodeProperties } from '../../../components/NodeProperties';
import { ReactFlowCodingQuestionNode } from '../../../components/ReactFlowNode';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CodingQuestionNodeData = NodeData & {};

export type CodingQuestionNode = PolyglotNode & {
  type: 'CodingQuestionNode';
  data: CodingQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<CodingQuestionNode>({
  elementType: 'CodingQuestionNode',
  name: 'Coding Question',
  propertiesComponent: CodingQuestionNodeProperties,
  elementComponent: ReactFlowCodingQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
  },
});
