import { MultipleChoiceQuestionNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowMultipleChoiceQuestionNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from "./Node";

export type MultipleChoiceQuestionNodeData = NodeData & {
    question: string;
    choices: string[];
    // TODO: correctAnswers should be number[] with a correctness score for each choice
    correctAnswers: string[];
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
        correctAnswers: [],
        question: "",
    }
});