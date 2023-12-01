import ReadMaterialNodeProperties from '../../../components/Properties/Nodes/ReadMaterialNodeProperties';
import { ReactFlowReadMaterialNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/readMaterial_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type ReadMaterialNodeData = NodeData & {
  text: string;
  link: string;
};

export type ReadMaterialNode = PolyglotNode & {
  type: 'ReadMaterialNode';
  data: ReadMaterialNodeData;
};

polyglotNodeComponentMapping.registerMapping<ReadMaterialNode>({
  elementType: 'ReadMaterialNode',
  name: 'Read material',
  icon: icon.src,
  group: 'remember_learning',
  propertiesComponent: ReadMaterialNodeProperties,
  elementComponent: ReactFlowReadMaterialNode,
  defaultData: {
    text: '',
    link: ' ',
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const oldData = node as ReadMaterialNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: oldData.data?.text,
      },
      {
        type: 'markdown',
        content: 'Run this link: ' + oldData.data?.link,
      },
    ];

    return {
      ...node,
      runtimeData: {
        challengeSetup,
        challengeContent,
      },
    };
  },
});
