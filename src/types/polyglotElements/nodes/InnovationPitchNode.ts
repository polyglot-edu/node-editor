import InnovationPitchNodeProperties from '../../../components/Properties/Nodes/InnovationPitchNodeProperties';
import { ReactFlowInnovationPitchNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
import { zip } from '../../../utils/utils';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type InnovationPitchNodeData = NodeData & {
  question: string;
  choices: string[];
  isChoiceCorrect: boolean[];
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
    choices: [],
    isChoiceCorrect: [],
    question: '',
  },
  transformData: (node) => {
    const oldData = node.data as InnovationPitchNodeData;

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
