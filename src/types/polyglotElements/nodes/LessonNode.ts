import { LessonNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowLessonNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from "./Node";

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

polyglotNodeComponentMapping.registerMapping<LessonNode>(
    "lessonNode",
    "Lesson",
    LessonNodeProperties,
    ReactFlowLessonNode,
    {
        ...defaultPolyglotNodeData,
    }
);