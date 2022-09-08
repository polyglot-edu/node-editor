import { CloseEndedQuestionNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowCloseEndedQuestionNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { ChallengeContent, ChallengeSetup, defaultPolyglotNodeData, NodeData, PolyglotNode } from "./Node";

export type CloseEndedQuestionNodeData = NodeData & {
    question: string;
    correctAnswers: string[];
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
        correctAnswers: [""],
    },
    transformData: (node) => {
        let lessonTextNode = node as CloseEndedQuestionNode;

        let challengeSetup: ChallengeSetup[] = [];
        let challengeContent: ChallengeContent[] = [{
            type: "markdown",
            content: lessonTextNode.data.question,
            priority: 0,
        }, {
            type: "csharp",
            content: "",
            priority: 1,
        }];

        return {
            ...node,
            runtimeData: {
                challengeSetup,
                challengeContent
            }
        }
    }
});