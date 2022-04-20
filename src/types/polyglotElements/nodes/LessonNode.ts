import { LessonNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowLessonNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export type LessonNodeData = NodeData & {
    file?: {
        name: string;
        // preview: string;
    };
}

export type LessonNode = PolyglotNode & {
    type: "lessonNode";
    data: LessonNodeData;
}

polyglotNodeComponentMapping.registerMapping("lessonNode", "Lesson", LessonNodeProperties, ReactFlowLessonNode);