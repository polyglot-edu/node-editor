import MemoriseKeywordsListNodeProperties from '../../../components/Properties/Nodes/MemoriseKeywordsListNodeProperties';
import { ReactFlowMemoriseKeywordsListNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type MemoriseKeywordsListNodeData = NodeData & {
  text: string;
};

export type MemoriseKeywordsListNode = PolyglotNode & {
  type: 'MemoriseKeywordsListNode';
  data: MemoriseKeywordsListNodeData;
};

polyglotNodeComponentMapping.registerMapping<MemoriseKeywordsListNode>({
  elementType: 'MemoriseKeywordsListNode',
  name: 'Lesson (Memorise keywords list)',
  icon: icon.src,
  group: 'remember_learning',
  propertiesComponent: MemoriseKeywordsListNodeProperties,
  elementComponent: ReactFlowMemoriseKeywordsListNode,
  defaultData: {
    text: '',
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const MemoriseKeywordsListNode = node as MemoriseKeywordsListNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: MemoriseKeywordsListNode.data?.text,
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
