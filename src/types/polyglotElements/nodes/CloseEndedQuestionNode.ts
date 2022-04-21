import { CloseEndedQuestionNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowCloseEndedQuestionNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from "./Node";

export type CloseEndedQuestionNodeData = NodeData & {
    question: string;
    correctAnswer: string;
};

export type CloseEndedQuestionNode = PolyglotNode & {
    type: "closeEndedQuestionNode";
    data: CloseEndedQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<CloseEndedQuestionNode>(
    "closeEndedQuestionNode",
    "Close Ended Question",
    CloseEndedQuestionNodeProperties,
    ReactFlowCloseEndedQuestionNode,
    {
        ...defaultPolyglotNodeData,
        question: "",
        correctAnswer: "",
    }
);