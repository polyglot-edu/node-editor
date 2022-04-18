import { PassFailEdgeProperties } from "../../../components/EdgeProperties";
import { polyglotEdgeComponentMapping } from "../elementMapping";
import { EdgeData, PolyglotEdge } from "./Edge";

export type PassFailEdgeData = EdgeData & {
    conditionKind: PassFailEdgeConditionKind;
}

export type PassFailEdge = PolyglotEdge & {
    type: "passFailEdge";
    data: PassFailEdgeData;
}

polyglotEdgeComponentMapping.registerMapping("passFailEdge", "PassFail", PassFailEdgeProperties, undefined);