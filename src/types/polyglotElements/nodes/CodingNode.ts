import { NodeType } from ".";
import { NodeData, PolyglotNode } from "./Node";

export interface CodingNodeData extends NodeData {
    other: number;
}

export interface CodingNode extends PolyglotNode {
    type: NodeType.Coding;
    data: CodingNodeData;
}