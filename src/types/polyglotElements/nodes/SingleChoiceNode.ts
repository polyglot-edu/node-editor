import { SingleChoiceNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowSingleChoiceNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export type SingleChoiceNodeData = NodeData & {
    question: string;
    correctAnswer: string;
};

export type SingleChoiceNode = PolyglotNode & {
    type: "singleChoiceNode";
    data: SingleChoiceNodeData;
};

polyglotNodeComponentMapping.registerMapping("singleChoiceNode", "Single Choice", SingleChoiceNodeProperties, ReactFlowSingleChoiceNode);