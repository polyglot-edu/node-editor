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
  platform: 'WebApp',
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
});
