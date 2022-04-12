import { MultipleChoiceNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowMultipleChoiceNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export type MultipleChoiceNodeData = NodeData & {
    options: string[];
};

export type MultipleChoiceNode = PolyglotNode & {
    type: "multipleChoiceNode";
    data: MultipleChoiceNodeData;
};

polyglotNodeComponentMapping.registerNodeType("multipleChoiceNode", "Multiple Choice", MultipleChoiceNodeProperties, ReactFlowMultipleChoiceNode);