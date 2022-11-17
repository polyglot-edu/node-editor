import { AbstractNodeProperties } from '../../../components/NodeProperties';
import { ReactFlowAbstractNode } from '../../../components/ReactFlowNode';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type AbstractNodeData = NodeData & {
  target: string;
};

export type AbstractNode = PolyglotNode & {
  type: 'AbstractNode';
  data: AbstractNodeData;
};

polyglotNodeComponentMapping.registerMapping<AbstractNode>({
  elementType: 'AbstractNode',
  name: 'Abstract Node',
  propertiesComponent: AbstractNodeProperties,
  elementComponent: ReactFlowAbstractNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    target: '',
  },
});
