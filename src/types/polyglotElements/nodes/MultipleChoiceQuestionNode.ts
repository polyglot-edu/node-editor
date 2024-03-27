import MultipleChoiceQuestionNodeProperties from '../../../components/Properties/Nodes/MultipleChoiceQuestionNodeProperties';
import { ReactFlowMultipleChoiceQuestionNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/mult_choice_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type MultipleChoiceQuestionNodeData = NodeData & {
  question: string;
  choices: string[];
  isChoiceCorrect: boolean[];
  aiQuestion: boolean;
  solution: string;
  language: string;
  text: string;
  level: number;
  questionCategory: number;
  n_o_ca: number;
  nedd: number;
  n_o_d: number;
};

export type MultipleChoiceQuestionNode = PolyglotNode & {
  type: 'multipleChoiceQuestionNode';
  data: MultipleChoiceQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<MultipleChoiceQuestionNode>({
  elementType: 'multipleChoiceQuestionNode',
  name: 'Multiple Choice Question',
  icon: icon.src,
  group: 'remember_assessment',
  propertiesComponent: MultipleChoiceQuestionNodeProperties,
  elementComponent: ReactFlowMultipleChoiceQuestionNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    choices: [],
    isChoiceCorrect: [],
    question: '',
    aiQuestion: false,
    solution: '',
    language: '',
    text: '',
    level: 0,
    questionCategory: 0,
    n_o_ca: 0,
    nedd: 0,
    n_o_d: 0,
  },
});
