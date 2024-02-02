import PromptEngineeringNodeProperties from '../../../components/Properties/Nodes/PromptEngineeringNodeProperties';
import { ReactFlowPromptEngineeringNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/coding_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import {
  ChallengeContent,
  ChallengeSetup,
  defaultPolyglotNodeData,
  NodeData,
  PolyglotNode,
} from './Node';

export type PromptEngineeringNodeData = NodeData & {
  question: string;
  codeTemplate: string;
  language: string;
};

export type PromptEngineeringNode = PolyglotNode & {
  type: 'PromptEngineeringNode';
  data: PromptEngineeringNodeData;
};

polyglotNodeComponentMapping.registerMapping<PromptEngineeringNode>({
  elementType: 'PromptEngineeringNode',
  name: 'Prompt Engineering',
  icon: icon.src,
  group: 'apply_learning',
  propertiesComponent: PromptEngineeringNodeProperties,
  elementComponent: ReactFlowPromptEngineeringNode,
  defaultData: {
    question: '',
    codeTemplate: `using System;

int main() {
    Console.WriteLine("Hello World!");
    return 0;
}`,
    language: 'csharp',
    ...defaultPolyglotNodeData,
  },
  transformData: (node) => {
    const oldData = node as PromptEngineeringNode;

    const challengeSetup: ChallengeSetup[] = [];
    const challengeContent: ChallengeContent[] = [
      {
        type: 'markdown',
        content: oldData.data?.question,
        priority: 0,
      },
      {
        type: oldData.data?.language,
        content: oldData.data?.codeTemplate,
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
