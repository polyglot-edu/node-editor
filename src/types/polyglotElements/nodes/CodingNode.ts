import { CodingNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowCodingNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export type CodingNodeData = NodeData & {
    other: number;
}

export type CodingNode = PolyglotNode & {
    type: "codingNode";
    kind: "codingNode";
    data: CodingNodeData;
} 

polyglotNodeComponentMapping.registerMapping("codingNode", "Coding", CodingNodeProperties, ReactFlowCodingNode);