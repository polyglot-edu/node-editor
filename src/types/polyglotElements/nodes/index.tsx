import { CodingProperties, MultipleChoiceProperties } from "../../../components/NodeProperties";
import { MultipleChoicePropertiesProps } from "../../../components/NodeProperties/MultipleChoiceProperties/MultipleChoiceProperties";
import { PropertyProps } from "../../../components/NodeProperties/Properties";
import { ReactFlowMultipleChoiceNode } from "../../../components/ReactFlowNodes";
import { CodingNode } from "./CodingNode";
import { PolyglotNode } from "./Node";

export enum NodeType {
    MultipleChoice = "multipleChoice",
    Coding = "coding",
}

export const nodeTypes = {
    multipleChoice: ReactFlowMultipleChoiceNode,
}

export const nodePropertiesType: { [key in NodeType | "noElement"]: (props: PolyglotNode) => JSX.Element } = {
    // @ts-expect-error
    multipleChoice: MultipleChoiceProperties,
    // @ts-expect-error
    coding: CodingProperties,
    noElement: () => <></>
}

const adfasfa = [MultipleChoiceProperties, CodingProperties];

export * from "./Node"
export * from "./MultipleChoiceNode"