import ScanningNodeProperties from '../../../components/Properties/Nodes/ScanningNodeProperties';
import { ReactFlowScanningNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/scanning_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type ScanningNodeData = NodeData & {
  text: string;
};

export type ScanningNode = PolyglotNode & {
  type: 'ScanningNode';
  data: ScanningNodeData;
};

polyglotNodeComponentMapping.registerMapping<ScanningNode>({
  elementType: 'ScanningNode',
  name: 'AR Scan',
  icon: icon.src,
  group: 'understand_learning',
  propertiesComponent: ScanningNodeProperties,
  elementComponent: ReactFlowScanningNode,
  defaultData: {
    text: '',
    link: '',
    uploadLearner: false,
    ...defaultPolyglotNodeData,
  },
});
