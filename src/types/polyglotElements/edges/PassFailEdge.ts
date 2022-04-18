import { polyglotEdgeComponentMapping } from "../elementMapping";
import { PassFailEdgeProperties } from "../../../components/EdgeProperties";
import { ReactFlowSmartBezierEdge } from "../../../components/ReactFlowEdge";
import { EdgeData, PolyglotEdge } from "./Edge";
import * as t from "io-ts";

export const PassFailEdgeConditionKind_IoTs = t.union([
    t.literal("pass"),
    t.literal("fail"),
]);
type PassFailEdgeConditionKind = t.TypeOf<typeof PassFailEdgeConditionKind_IoTs>;

export type PassFailEdgeData = EdgeData & {
    conditionKind: PassFailEdgeConditionKind;
}

export type PassFailEdge = PolyglotEdge & {
    type: "passFailEdge";
    data: PassFailEdgeData;
}

polyglotEdgeComponentMapping.registerMapping("passFailEdge", "Pass/Fail", PassFailEdgeProperties, ReactFlowSmartBezierEdge);