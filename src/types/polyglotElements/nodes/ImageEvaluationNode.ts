import ImageEvaluationNodeProperties from '../../../components/Properties/Nodes/ImageEvaluationNodeProperties';
import { ReactFlowImageEvaluationNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
import { zip } from '../../../utils/utils';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type ImageEvaluationNodeData = NodeData & {
  question: string;
  choices: string[];
  isChoiceCorrect: boolean[];
};

export type ImageEvaluationNode = PolyglotNode & {
  type: 'ImageEvaluationNode';
  data: ImageEvaluationNodeData;
};

polyglotNodeComponentMapping.registerMapping<ImageEvaluationNode>({
  elementType: 'ImageEvaluationNode',
  name: 'Image Evaluation',
  icon: icon.src,
  group: 'apply_assessment',
  propertiesComponent: ImageEvaluationNodeProperties,
  elementComponent: ReactFlowImageEvaluationNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    choices: [],
    isChoiceCorrect: [],
    question: '',
  },
  transformData: (node) => {
    const oldData = node.data as ImageEvaluationNodeData;

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
