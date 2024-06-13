import UMLModelingNodeProperties from '../../../components/Properties/Nodes/UMLModelingNodeProperties';
import { ReactFlowUMLModelingNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/collaborative_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type UMLModelingNodeData = NodeData & {
  assignment: string;
  idUML: string;
  projectUML: string;
  collaborative: boolean;
};

export type UMLModelingNode = PolyglotNode & {
  type: 'UMLModelingNode';
  data: UMLModelingNodeData;
};

polyglotNodeComponentMapping.registerMapping<UMLModelingNode>({
  elementType: 'UMLModelingNode',
  name: 'UML Modeling',
  icon: icon.src,
  group: 'understand_assessment',
  propertiesComponent: UMLModelingNodeProperties,
  elementComponent: ReactFlowUMLModelingNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    assignment: '',
    idUML: '',
    projectUML: '',
    collaborative: false,
  },
});
