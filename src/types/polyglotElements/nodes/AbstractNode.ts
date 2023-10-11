import AbstractNodeProperties from '../../../components/Properties/Nodes/AbstractNodeProperties';
import { ReactFlowAbstractNode } from '../../../components/ReactFlowNode';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type AbstractNodeData = NodeData & {
  target: string;
  conceptmap?: object;
};

export type AbstractNode = PolyglotNode & {
  type: 'abstractNode';
  data: AbstractNodeData;
};

polyglotNodeComponentMapping.registerMapping<AbstractNode>({
  elementType: 'abstractNode',
  name: 'Abstract Node',
icon: 'abstract_icon.png',
  propertiesComponent: AbstractNodeProperties,
  elementComponent: ReactFlowAbstractNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    target: '',
  },
});
