import CreateKeywordsListNodeProperties from '../../../components/Properties/Nodes/CreateKeywordsListNodeProperties';
import { ReactFlowCreateKeywordsListNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/listActivity_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type CreateKeywordsListNodeData = NodeData & {
  instructions: string;
};

export type CreateKeywordsListNode = PolyglotNode & {
  type: 'CreateKeywordsListNode';
  data: CreateKeywordsListNodeData;
};

polyglotNodeComponentMapping.registerMapping<CreateKeywordsListNode>({
  elementType: 'CreateKeywordsListNode',
  name: 'Create keywords list',
  icon: icon.src,
  group: 'remember_learning',
  propertiesComponent: CreateKeywordsListNodeProperties,
  elementComponent: ReactFlowCreateKeywordsListNode,
  defaultData: {
    instructions: '',
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const oldData = node as CreateKeywordsListNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: oldData.data?.text,
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
