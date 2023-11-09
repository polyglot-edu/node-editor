import TrueFalseNodeProperties from '../../../components/Properties/Nodes/TrueFalseNodeProperties';
import { ReactFlowTrueFalseNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/trueFalse_icon.png';
import { zip } from '../../../utils/utils';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type TrueFalseNodeData = NodeData & {
  instructions: string;
  questions: string[];
  isQuestionCorrect: boolean[];
  negativePoints: number;
  positvePoints: number;
};

export type TrueFalseNode = PolyglotNode & {
  type: 'TrueFalseNode';
  data: TrueFalseNodeData;
};

polyglotNodeComponentMapping.registerMapping<TrueFalseNode>({
  elementType: 'TrueFalseNode',
  name: 'True/False',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: TrueFalseNodeProperties,
  elementComponent: ReactFlowTrueFalseNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    questions: [],
    isQuestionCorrect: [],
    negativePoints: 0,
    positvePoints: 1,
    instructions: '',
  },
  transformData: (node) => {
    const oldData = node.data as TrueFalseNodeData;

    const data = {
      ...oldData,
      correctAnswers: zip(
        oldData?.questions,
        oldData?.isQuestionCorrect
      ).reduce((acc, { first, second }) => {
        if (second) {
          acc.push(first);
        }
        return acc;
      }, [] as string[]),
    };
    /*
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
*/
    return {
      ...node,
      data,
      runtimeData: {
        //challengeSetup,
        //challengeContent,
      },
    };
  },
});
