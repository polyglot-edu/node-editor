import * as t from 'io-ts';
import { PassFailEdgeProperties } from '../../../components/EdgeProperties';
import { ReactFlowSmartBezierEdge } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';

export const PassFailEdgeConditionKind_IoTs = t.union([
  t.literal('pass'),
  t.literal('fail'),
]);
type PassFailEdgeConditionKind = t.TypeOf<
  typeof PassFailEdgeConditionKind_IoTs
>;

export type PassFailEdgeData = EdgeData & {
  conditionKind: PassFailEdgeConditionKind;
};

export type PassFailEdge = PolyglotEdge & {
  type: 'PassFailEdge';
  data: PassFailEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<PassFailEdge>({
  elementType: 'PassFailEdge',
  name: 'Pass/Fail',
  propertiesComponent: PassFailEdgeProperties,
  elementComponent: ReactFlowSmartBezierEdge,
  defaultData: {
    ...defaultPolyglotEdgeData,
    conditionKind: 'pass',
  },
  transformData: (edge) => {
    const code = `
(bool, string) validate(PolyglotValidationContext context) {
    var isSubmissionCorrect = context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode);
    var conditionKind = context.Condition.Data.conditionKind switch
    {
        "pass" => true,
        "fail" => false,
        _ => throw new Exception("Unknown condition kind")
    };
    return (conditionKind == isSubmissionCorrect, "Pass/Fail edge");
}`;

    return {
      ...edge,
      code,
    };
  },
});
