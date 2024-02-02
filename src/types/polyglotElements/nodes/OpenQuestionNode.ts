import OpenQuestionNodeProperties from '../../../components/Properties/Nodes/OpenQuestionNodeProperties';
import { ReactFlowOpenQuestionNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/simulation_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type OpenQuestionNodeData = NodeData & {
  question: string;
  material: string;
  aiQuestion: boolean;
  language?: string;
  questionGenerated?: string;
  possibleAnswer?: string;
  questionCategory?: number;
  questionType?: number;
};

export type OpenQuestionNode = PolyglotNode & {
  type: 'OpenQuestionNode';
  data: OpenQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<OpenQuestionNode>({
  elementType: 'OpenQuestionNode',
  name: 'Open Question',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: OpenQuestionNodeProperties,
  elementComponent: ReactFlowOpenQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    question: '',
    material: '',
    aiQuestion: false,
    language: 'English',
    questionGenerated: '',
    possibleAnswer: '',
    questionCategory: 0,
    questionType: 0,
  },
});
