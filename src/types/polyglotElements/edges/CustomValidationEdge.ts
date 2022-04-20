import { polyglotEdgeComponentMapping } from "../elementMapping";
import { CustomValidationEdgeProperties } from "../../../components/EdgeProperties";
import { ReactFlowSmartBezierEdge } from "../../../components/ReactFlowEdge";
import { EdgeData, PolyglotEdge } from "./Edge";

export type CustomValidationEdgeData = EdgeData & {
    // TODO: this should be generic and should match the type of the answer of the node it is connected to
    code: string;
}

export type CustomValidationEdge = PolyglotEdge & {
    type: "customValidationEdge";
    data: CustomValidationEdgeData;
}

polyglotEdgeComponentMapping.registerMapping("customValidationEdge", "Custom Validation", CustomValidationEdgeProperties, ReactFlowSmartBezierEdge);