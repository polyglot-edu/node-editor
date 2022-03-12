import { CodingProperties } from "../../../components/NodeProperties";
import { ReactFlowCodingNode } from "../../../components/ReactFlowNodes";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export interface CodingNodeData extends NodeData {
    other: number;
}

export interface CodingNode extends PolyglotNode {
    type: "codingNode";
    data: CodingNodeData;
}

polyglotNodeComponentMapping.registerNodeType("codingNode", CodingProperties, ReactFlowCodingNode);