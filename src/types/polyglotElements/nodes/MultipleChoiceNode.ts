import { NodeType } from ".";
import { NodeData, PolyglotNode } from "./Node";

export interface MultipleChoiceNodeData extends NodeData {
    options: string[];
}

export interface MultipleChoiceNode extends PolyglotNode {
    type: NodeType.MultipleChoice;
    data: MultipleChoiceNodeData;
}