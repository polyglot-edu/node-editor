import { polyglotEdgeComponentMapping } from "../elementMapping";
import { ReactFlowSmartBezierEdge } from "../../../components/ReactFlowEdge";
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from "./Edge";
import { EdgePropertiesProps } from "../../../components/EdgeProperties/EdgeProperties";

export type UnconditionalEdgeData = EdgeData & {}

export type UnconditionalEdge = PolyglotEdge & {
    type: "unconditionalEdge";
    data: UnconditionalEdgeData;
}

polyglotEdgeComponentMapping.registerMapping<UnconditionalEdge>({
    elementType: "unconditionalEdge",
    name: "Unconditional",
    propertiesComponent: (props: EdgePropertiesProps) => (<></>),
    elementComponent: ReactFlowSmartBezierEdge,
    defaultData: {
        ...defaultPolyglotEdgeData,
    },
    transformData: (edge) => {
        const code = `
async Task<(bool, string)> validate(PolyglotValidationContext context) {
    return (true, "Unconditional edge");
}`;


        return {
            ...edge,
            code
        };
    },
});