import ImageEvaluationNodeProperties from '../../../components/Properties/Nodes/ImageEvaluationNodeProperties';
import { ReactFlowImageEvaluationNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/evaluationActivity_icon.png';
import { zip } from '../../../utils/utils';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type ImageEvaluationNodeData = NodeData & {
  link: string;
  question: string;
  answers: string[];
  isAnswerCorrect: boolean[];
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
    link: '',
    answers: [],
    isAnswerCorrect: [],
    question: '',
  },
  transformData: (node) => {
    const oldData = node.data as ImageEvaluationNodeData;

    const data = {
      ...oldData,
      correctAnswers: zip(oldData?.answers, oldData?.isAnswerCorrect).reduce(
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
