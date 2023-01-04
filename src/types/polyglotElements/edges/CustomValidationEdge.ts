import CustomValidationEdgeProperties from '../../../components/Properties/Edges/CustomValidationEdgeProperties';
import { ReactFlowSmartBezierEdge } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';

export type CustomValidationEdgeData = EdgeData & {
  // TODO: this should be generic and should match the type of the answer of the node it is connected to
  code: string;
};

export type CustomValidationEdge = PolyglotEdge & {
  type: 'customValidationEdge';
  data: CustomValidationEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<CustomValidationEdge>({
  elementType: 'customValidationEdge',
  name: 'Custom Validation',
  propertiesComponent: CustomValidationEdgeProperties,
  elementComponent: ReactFlowSmartBezierEdge,
  defaultData: {
    ...defaultPolyglotEdgeData,
    code: `async Task<(bool, string)> validate(PolyglotValidationContext context) {
    // your validation code goes here
}`,
  },
  transformData: (edge) => {
    const customValidationEdge = edge as CustomValidationEdge;
    const code = customValidationEdge.data?.code;

    return {
      ...edge,
      code,
    };
  },
});
