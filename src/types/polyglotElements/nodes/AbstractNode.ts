import AbstractNodeProperties from '../../../components/Properties/Nodes/AbstractNodeProperties';
import { ReactFlowAbstractNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
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
  icon: icon.src,
  group: 'remember_learning',
  propertiesComponent: AbstractNodeProperties,
  elementComponent: ReactFlowAbstractNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    target: '',
  },
});
