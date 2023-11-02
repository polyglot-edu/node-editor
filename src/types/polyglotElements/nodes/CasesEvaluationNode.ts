import CasesEvaluationNodeProperties from '../../../components/Properties/Nodes/CasesEvaluationNodeProperties';
import { ReactFlowCasesEvaluationNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CasesEvaluationNodeData = NodeData & {
  guidelines: string;
  text: string;
  link: string;
  uploadLearner: boolean;
};

export type CasesEvaluationNode = PolyglotNode & {
  type: 'CasesEvaluationNode';
  data: CasesEvaluationNodeData;
};

polyglotNodeComponentMapping.registerMapping<CasesEvaluationNode>({
  elementType: 'CasesEvaluationNode',
  name: 'Cases Evaluation',
  icon: icon.src,
  group: 'understand_assessment',
  propertiesComponent: CasesEvaluationNodeProperties,
  elementComponent: ReactFlowCasesEvaluationNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    guidelines: '',
    text: '',
    link: '',
    uploadLearner: false,
  },
  transformData: (node) => {
    const oldData = node.data as CasesEvaluationNodeData;

    const data = {
      ...oldData,
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
