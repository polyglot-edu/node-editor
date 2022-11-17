import { LessonNodeProperties } from '../../../components/NodeProperties';
import { ReactFlowLessonNode } from '../../../components/ReactFlowNode';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type LessonNodeData = NodeData & {
  file?: {
    name: string;
    // preview: string;
  };
};

export type LessonNode = PolyglotNode & {
  type: 'LessonNode';
  data: LessonNodeData;
};

polyglotNodeComponentMapping.registerMapping<LessonNode>({
  elementType: 'LessonNode',
  name: 'Lesson',
  propertiesComponent: LessonNodeProperties,
  elementComponent: ReactFlowLessonNode,
  defaultData: {
    ...defaultPolyglotNodeData,
  },
});
