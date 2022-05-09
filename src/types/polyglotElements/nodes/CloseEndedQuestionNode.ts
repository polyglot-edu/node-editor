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

polyglotNodeComponentMapping.registerMapping<CloseEndedQuestionNode>({
    elementType: "closeEndedQuestionNode",
    name: "Close Ended Question",
    propertiesComponent: CloseEndedQuestionNodeProperties,
    elementComponent: ReactFlowCloseEndedQuestionNode,
    defaultData: {
        ...defaultPolyglotNodeData,
        question: "",
        correctAnswer: "",
    }
});