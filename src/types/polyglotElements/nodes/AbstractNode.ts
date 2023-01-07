// import { AbstractNodeProperties } from '../../../components/NodeProperties';
// import { ReactFlowAbstractNode } from '../../../components/ReactFlowNode';
// import { polyglotNodeComponentMapping } from '../elementMapping';
import { NodeData, PolyglotNode } from './Node';

export type AbstractNodeData = NodeData & {
  target: string;
};

export type AbstractNode = PolyglotNode & {
  type: 'abstractNode';
  data: AbstractNodeData;
};

// polyglotNodeComponentMapping.registerMapping<AbstractNode>({
//   elementType: 'abstractNode',
//   name: 'Abstract Node',
//   propertiesComponent: AbstractNodeProperties,
//   elementComponent: ReactFlowAbstractNode,
//   defaultData: {
//     ...defaultPolyglotNodeData,
//     target: '',
//   },
// });
