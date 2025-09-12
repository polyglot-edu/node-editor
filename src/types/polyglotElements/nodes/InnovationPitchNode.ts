import InnovationPitchNodeProperties from '../../../components/Properties/Nodes/InnovationPitchNodeProperties';
import { ReactFlowInnovationPitchNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/innovationPitch_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type InnovationPitchNodeData = NodeData & {
  guidelines: string;
  text: string;
  link: string;
  uploadLearner: boolean;
};

export type InnovationPitchNode = PolyglotNode & {
  type: 'InnovationPitchNode';
  data: InnovationPitchNodeData;
};

polyglotNodeComponentMapping.registerMapping<InnovationPitchNode>({
  elementType: 'InnovationPitchNode',
  name: 'Innovation Pitch',
  icon: icon.src,
  group: 'create_assessment',
  propertiesComponent: InnovationPitchNodeProperties,
  elementComponent: ReactFlowInnovationPitchNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    guidelines: '',
    text: '',
    link: '',
    uploadLearner: false,
  },
});
