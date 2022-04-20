import { CloseEndedQuestionNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowCloseEndedQuestionNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export type CloseEndedQuestionNodeData = NodeData & {
    question: string;
    correctAnswer: string;
};

export type CloseEndedQuestionNode = PolyglotNode & {
    type: "closeEndedQuestionNode";
    data: CloseEndedQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping("closeEndedQuestionNode", "Close Ended Question", CloseEndedQuestionNodeProperties, ReactFlowCloseEndedQuestionNode);