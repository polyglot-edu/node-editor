import { polyglotEdgeComponentMapping } from "../elementMapping";
import { ExactValueEdgeProperties } from "../../../components/EdgeProperties";
import { ReactFlowSmartBezierEdge } from "../../../components/ReactFlowEdge";
import { EdgeData, PolyglotEdge } from "./Edge";

export type ExactValueEdgeData = EdgeData & {
    // TODO: this should be generic and should match the type of the answer of the node it is connected to
    value: string;
}

export type ExactValueEdge = PolyglotEdge & {
    type: "exactValueEdge";
    data: ExactValueEdgeData;
}

polyglotEdgeComponentMapping.registerMapping("exactValueEdge", "Exact Value", ExactValueEdgeProperties, ReactFlowSmartBezierEdge);