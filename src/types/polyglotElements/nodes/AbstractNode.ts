import AbstractNodeProperties from '../../../components/Properties/Nodes/AbstractNodeProperties';
import { ReactFlowAbstractNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/abstract_icon.png';
import { EducationLevel, LearningOutcome, Topic } from '../AIGenerativeTypes';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type AbstractNodeData = NodeData & {
  sourceMaterial: string;
  learning_outcome: LearningOutcome;
  education_level: EducationLevel;
  topicsAI: Topic[];
  language: string;
  macro_subject: string;
};

export type AbstractNode = PolyglotNode & {
  type: 'abstractNode';
  data: AbstractNodeData;
};

polyglotNodeComponentMapping.registerMapping<AbstractNode>({
  elementType: 'abstractNode',
  name: 'Abstract Node',
  icon: icon.src,
  group: 'remember_learning',
  propertiesComponent: AbstractNodeProperties,
  elementComponent: ReactFlowAbstractNode,
  defaultData: {
    ...defaultPolyglotNodeData,
    sourceMaterial: '',
    learning_outcome: LearningOutcome.ApplyKnowledge,
    education_level: EducationLevel.College,
    topicsAI: [],
    language: '',
    macro_subject: '',
  },
});
