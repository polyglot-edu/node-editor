import CodingQuestionNodeProperties from '../../../components/Properties/Nodes/CodingQuestionNodeProperties';
import { ReactFlowCodingQuestionNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/coding_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type CodingQuestionNodeData = NodeData & {
  question: string;
  codeTemplate: string;
  language: string;
};

export type CodingQuestionNode = PolyglotNode & {
  type: 'codingQuestionNode';
  data: CodingQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<CodingQuestionNode>({
  elementType: 'codingQuestionNode',
  name: 'Coding Question',
  icon: icon.src,
  group: 'create_assessment',
  propertiesComponent: CodingQuestionNodeProperties,
  elementComponent: ReactFlowCodingQuestionNode,
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
