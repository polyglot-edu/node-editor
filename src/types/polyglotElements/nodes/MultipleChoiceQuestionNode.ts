import MultipleChoiceQuestionNodeProperties from '../../../components/Properties/Nodes/MultipleChoiceQuestionNodeProperties';
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

    const challengeSetup: ChallengeSetup[] = [
      `
using Polyglot.Interactive;
var kernel = Kernel.Root.FindKernelByName("multiplechoice") as MultipleChoiceKernel;
kernel.Options = new HashSet<string> { ${data.choices
        .map((_, i) => `"${i + 1}"`)
        .join(', ')} };
`,
    ];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'multiplechoice',
        content: '',
        priority: 1,
      },
      {
        type: 'markdown',
        content:
          data.question +
          data.choices.map((value, index) => '\n' + (index + 1) + '. ' + value),
        priority: 0,
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
