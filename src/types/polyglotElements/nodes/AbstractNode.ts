import { AbstractNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowAbstractNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from "./Node";

export type AbstractNodeData = NodeData & {
    question: string;
    correctAnswers: string[];
};

export type AbstractNode = PolyglotNode & {
    type: "abstractNode";
    data: AbstractNodeData;
};

polyglotNodeComponentMapping.registerMapping<AbstractNode>({
    elementType: "abstractNode",
    name: "Abstract Node",
    propertiesComponent: AbstractNodeProperties,
    elementComponent: ReactFlowAbstractNode,
    defaultData: {
        ...defaultPolyglotNodeData,
        question: "",
        correctAnswers: [""],
    }
});