import { EdgePropertiesProps } from '../../../components/EdgeProperties/EdgeProperties';
import { ReactFlowSmartBezierEdge } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';

export type UnconditionalEdgeData = EdgeData & {};

export type UnconditionalEdge = PolyglotEdge & {
  type: 'UnconditionalEdge';
  data: UnconditionalEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<UnconditionalEdge>({
  elementType: 'UnconditionalEdge',
  name: 'Unconditional',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  propertiesComponent: (props: EdgePropertiesProps) => <></>,
  elementComponent: ReactFlowSmartBezierEdge,
  defaultData: {
    ...defaultPolyglotEdgeData,
  },
  transformData: (edge) => {
    const code = `
(bool, string) validate(PolyglotValidationContext context) {
    return (true, "Unconditional edge");
}`;

    return {
      ...edge,
      code,
    };
  },
});
