import { polyglotEdgeComponentMapping } from "../elementMapping";
import { ReactFlowSmartBezierEdge } from "../../../components/ReactFlowEdge";
import { EdgeData, PolyglotEdge } from "./Edge";
import { EdgePropertiesProps } from "../../../components/EdgeProperties/EdgeProperties";

export type UnconditionalEdgeData = EdgeData & {}

export type UnconditionalEdge = PolyglotEdge & {
    type: "unconditionalEdge";
    data: UnconditionalEdgeData;
}

polyglotEdgeComponentMapping.registerMapping("unconditionalEdge", "Unconditional", (props: EdgePropertiesProps) => (<></>), ReactFlowSmartBezierEdge);