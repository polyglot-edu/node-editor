import NewTypeNodeProperties from '../../../components/Properties/Nodes/NewTypeNodeProperties';
import { ReactFlowNewTypeNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/collaborative_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type NewTypeNodeData = NodeData & {
  assignment: string;
  idUML: string;
  projectUML: string;
  collaborative: boolean;
};

export type NewTypeNode = PolyglotNode & {
  type: 'NewTypeNode';
  data: NewTypeNodeData;
};

polyglotNodeComponentMapping.registerMapping<NewTypeNode>({
  elementType: 'NewTypeNode',
  name: 'New Type xText',
  icon: icon.src,
  group: '',
  platform: 'WebApp',
  propertiesComponent: NewTypeNodeProperties,
  elementComponent: ReactFlowNewTypeNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    assignment: '',
    idUML: '',
    projectUML: '',
    collaborative: false,
  },
});
