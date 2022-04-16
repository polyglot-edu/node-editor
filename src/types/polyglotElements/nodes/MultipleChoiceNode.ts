import { MultipleChoiceNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowMultipleChoiceNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { NodeData, PolyglotNode } from "./Node";

export type MultipleChoiceNodeData = NodeData & {
    question: string;
    choices: string[];
    // TODO: correctAnswers should be number[] with a correctness score for each choice
    correctAnswers: string[];
};

export type MultipleChoiceNode = PolyglotNode & {
    type: "multipleChoiceNode";
    kind: "multipleChoiceNode";
    data: MultipleChoiceNodeData;
};

polyglotNodeComponentMapping.registerMapping("multipleChoiceNode", "Multiple Choice", MultipleChoiceNodeProperties, ReactFlowMultipleChoiceNode);