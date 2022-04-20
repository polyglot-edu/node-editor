import { CodingQuestionNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowCodingQuestionNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export type CodingQuestionNodeData = NodeData & {
}

export type CodingQuestionNode = PolyglotNode & {
    type: "codingQuestionNode";
    data: CodingQuestionNodeData;
}

polyglotNodeComponentMapping.registerMapping("codingQuestionNode", "Coding Question", CodingQuestionNodeProperties, ReactFlowCodingQuestionNode);