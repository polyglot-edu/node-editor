import { MultipleChoiceQuestionNodeProperties } from '../../../components/NodeProperties';
import { ReactFlowMultipleChoiceQuestionNode } from '../../../components/ReactFlowNode';
import { zip } from '../../../utils/utils';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type MultipleChoiceQuestionNodeData = NodeData & {
  question: string;
  choices: string[];
  isChoiceCorrect: boolean[];
};

export type MultipleChoiceQuestionNode = PolyglotNode & {
  type: 'multipleChoiceQuestionNode';
  data: MultipleChoiceQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<MultipleChoiceQuestionNode>({
  elementType: 'multipleChoiceQuestionNode',
  name: 'Multiple Choice Question',
  propertiesComponent: MultipleChoiceQuestionNodeProperties,
  elementComponent: ReactFlowMultipleChoiceQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    choices: [],
    isChoiceCorrect: [],
    question: '',
  },
  transformData: (node) => {
    const oldData = node.data as MultipleChoiceQuestionNodeData;

    const data = {
      ...oldData,
      correctAnswers: zip(oldData?.choices, oldData?.isChoiceCorrect).reduce(
        (acc, { first, second }) => {
          if (second) {
            acc.push(first);
          }
          return acc;
        },
        [] as string[]
      ),
    };

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'csharp',
        content: '',
      },
      {
        type: 'markdown',
        content:
          data.question +
          (data.choices.length > 0
            ? '  \n- ' + data.choices.join('  \n- ')
            : ''),
      },
    ];

    return {
      ...node,
      data,
      runtimeData: {
        challengeSetup,
        challengeContent,
      },
    };
  },
});
