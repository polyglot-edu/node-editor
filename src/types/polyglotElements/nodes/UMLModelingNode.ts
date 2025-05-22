import UMLModelingNodeProperties from '../../../components/Properties/Nodes/UMLModelingNodeProperties';
import { ReactFlowUMLModelingNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/papyrusWebIcon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { PapyTag } from '../PapyrusTypes/PapyrusTypes';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type UMLModelingNodeData = NodeData & {
  assignment: string;
  title: string;
  idUML: string;
  projectUML: string;
  mode: string;
  tags?: PapyTag[];
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
  platform: 'PapyrusWeb',
  propertiesComponent: UMLModelingNodeProperties,
  elementComponent: ReactFlowUMLModelingNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    assignment: '',
    title: '',
    idUML: '',
    projectUML: '',
    mode: 'Default',
    tags: [],
  },
});
