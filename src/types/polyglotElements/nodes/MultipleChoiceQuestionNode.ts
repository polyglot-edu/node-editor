import { MultipleChoiceQuestionNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowMultipleChoiceQuestionNode } from "../../../components/ReactFlowNode";
import { zip } from "../../../utils/utils";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from "./Node";

export type MultipleChoiceQuestionNodeData = NodeData & {
    question: string;
    choices: string[];
    isChoiceCorrect: boolean[];
};

export type MultipleChoiceQuestionNode = PolyglotNode & {
    type: "multipleChoiceQuestionNode";
    data: MultipleChoiceQuestionNodeData;
};

polyglotNodeComponentMapping.registerMapping<MultipleChoiceQuestionNode>({
    elementType: "multipleChoiceQuestionNode",
    name: "Multiple Choice Question",
    propertiesComponent: MultipleChoiceQuestionNodeProperties,
    elementComponent: ReactFlowMultipleChoiceQuestionNode,
    defaultData: {
        ...defaultPolyglotNodeData,
        choices: [],
        isChoiceCorrect: [],
        question: "",
    },
    transformData: (node) => {
        const oldData = node.data as MultipleChoiceQuestionNodeData;

        let data = {
            ...oldData,
            correctAnswers: zip(oldData.choices, oldData.isChoiceCorrect)
                .reduce((acc, { first, second }) => {
                    if (second) {
                        acc.push(first);
                    }
                    return acc;
                }, [] as string[])
        };

        return {
            ...node,
            data
        }
    }
});