import { MultipleChoiceProperties } from "../../../components/NodeProperties";
import { ReactFlowMultipleChoiceNode } from "../../../components/ReactFlowNodes";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export interface MultipleChoiceNodeData extends NodeData {
    options: string[];
}

export interface MultipleChoiceNode extends PolyglotNode {
    type: "multipleChoiceNode";
    data: MultipleChoiceNodeData;
}

polyglotNodeComponentMapping.registerNodeType("multipleChoiceNode", MultipleChoiceProperties, ReactFlowMultipleChoiceNode);