import CollaborativeModelingNodeProperties from '../../../components/Properties/Nodes/CollaborativeModelingNodeProperties';
import { ReactFlowCollaborativeModelingNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/collaborative_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CollaborativeModelingNodeData = NodeData & {
  question: string;
  correctAnswers: string[];
};

export type CollaborativeModelingNode = PolyglotNode & {
  type: 'CollaborativeModelingNode';
  data: CollaborativeModelingNodeData;
};

polyglotNodeComponentMapping.registerMapping<CollaborativeModelingNode>({
  elementType: 'CollaborativeModelingNode',
  name: 'Collaborative Modeling',
  icon: icon.src,
  group: 'understand_assessment',
  propertiesComponent: CollaborativeModelingNodeProperties,
  elementComponent: ReactFlowCollaborativeModelingNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    correctAnswers: [''],
  },
});
