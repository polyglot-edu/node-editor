import ExactValueEdgeProperties from '../../../components/Properties/Edges/ExactValueEdgeProperties';
import { ReactFlowSmartBezierEdge } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';

export type ExactValueEdgeData = EdgeData & {
  // TODO: this should be generic and should match the type of the answer of the node it is connected to
  value: string;
};

export type ExactValueEdge = PolyglotEdge & {
  type: 'exactValueEdge';
  data: ExactValueEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<ExactValueEdge>({
  elementType: 'exactValueEdge',
  name: 'Exact Value',
  propertiesComponent: ExactValueEdgeProperties,
  elementComponent: ReactFlowSmartBezierEdge,
  defaultData: {
    ...defaultPolyglotEdgeData,
    value: '',
  },
  transformData: (edge) => {
    const code = `
async Task<(bool, string)> validate(PolyglotValidationContext context) {
    return (String.Equals(context.Condition.Data.value, context.JourneyContext.SubmittedCode), "Exact value edge");
}`;

    return {
      ...edge,
      code,
    };
  },
});
