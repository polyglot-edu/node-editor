import { PassFailEdgeProperties } from "../../../components/EdgeProperties";
import { polyglotEdgeComponentMapping } from "../elementMapping";
import { EdgeData, PolyglotEdge } from "./Edge";

export type PassFailEdgeData = EdgeData & {
}

export type PassFailEdge = PolyglotEdge & {
    type: "BezierEdge"
    kind: "passFailEdge";
    data: PassFailEdgeData;
}

polyglotEdgeComponentMapping.registerMapping("passFailEdge", "PassFail", PassFailEdgeProperties, undefined);