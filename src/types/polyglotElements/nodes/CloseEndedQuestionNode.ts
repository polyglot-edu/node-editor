import CloseEndedQuestionNodeProperties from '../../../components/Properties/Nodes/CloseEndedQuestionNodeProperties';
import { ReactFlowCloseEndedQuestionNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/close_question_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type CloseEndedQuestionNodeData = NodeData & {
  question: string;
  correctAnswers: string[];
};

export type CloseEndedQuestionNode = PolyglotNode & {
  type: 'closeEndedQuestionNode';
  data: CloseEndedQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<CloseEndedQuestionNode>({
  elementType: 'closeEndedQuestionNode',
  name: 'Close Ended Question',
  icon: icon.src,
  group: 'remember_assessment', 
  propertiesComponent: CloseEndedQuestionNodeProperties,
  elementComponent: ReactFlowCloseEndedQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    correctAnswers: [''],
  },
  transformData: (node) => {
    const lessonTextNode = node as CloseEndedQuestionNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: lessonTextNode.data?.question,
        priority: 0,
      },
      {
        type: 'html',
        content: '',
        priority: 1,
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
