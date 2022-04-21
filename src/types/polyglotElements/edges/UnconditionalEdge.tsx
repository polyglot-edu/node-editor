import { polyglotEdgeComponentMapping } from "../elementMapping";
import { ReactFlowSmartBezierEdge } from "../../../components/ReactFlowEdge";
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from "./Edge";
import { EdgePropertiesProps } from "../../../components/EdgeProperties/EdgeProperties";

export type UnconditionalEdgeData = EdgeData & {}

export type UnconditionalEdge = PolyglotEdge & {
    type: "unconditionalEdge";
    data: UnconditionalEdgeData;
}

polyglotEdgeComponentMapping.registerMapping<UnconditionalEdge>(
    "unconditionalEdge",
    "Unconditional",
    (props: EdgePropertiesProps) => (<></>),
    ReactFlowSmartBezierEdge,
    {
        ...defaultPolyglotEdgeData,
    }
);