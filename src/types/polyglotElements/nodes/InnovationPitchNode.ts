import InnovationPitchNodeProperties from '../../../components/Properties/Nodes/InnovationPitchNodeProperties';
import { ReactFlowInnovationPitchNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/innovationPitch_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type InnovationPitchNodeData = NodeData & {
  guidelines: string;
  text: string;
  link: string;
  uploadLearner: boolean;
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
    guidelines: '',
    text: '',
    link: '',
    uploadLearner: false,
  },
  transformData: (node) => {
    const oldData = node.data as InnovationPitchNodeData;

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
