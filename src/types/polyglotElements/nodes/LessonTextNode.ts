import LessonTextNodeProperties from '../../../components/Properties/Nodes/LessonTextNodeProperties';
import { ReactFlowLessonNode } from '../../../components/ReactFlowNode';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type LessonTextNodeData = NodeData & {
  text: string;
};

export type LessonTextNode = PolyglotNode & {
  type: 'lessonTextNode';
  data: LessonTextNodeData;
};

polyglotNodeComponentMapping.registerMapping<LessonTextNode>({
  elementType: 'lessonTextNode',
  name: 'Lesson (Text)',
  propertiesComponent: LessonTextNodeProperties,
  elementComponent: ReactFlowLessonNode,
  defaultData: {
    text: '',
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const lessonTextNode = node as LessonTextNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: lessonTextNode.data?.text,
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
