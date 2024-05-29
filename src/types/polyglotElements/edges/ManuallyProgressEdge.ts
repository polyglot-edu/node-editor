import * as t from 'io-ts';
import ManuallyProgressEdgeProperties from '../../../components/Properties/Edges/ManuallyProgressEdge';
import { ReactFlowSmartBezierEdgePassFail } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';

export const ManuallyProgressConditionKind_IoTs = t.union([
  t.literal('pass'),
  t.literal('fail'),
]);
type ManuallyProgressEdgeConditionKind = t.TypeOf<
  typeof ManuallyProgressConditionKind_IoTs
>;

export type ManuallyProgressEdgeData = EdgeData & {
  conditionKind: ManuallyProgressEdgeConditionKind;
};

export type ManuallyProgressEdge = PolyglotEdge & {
  type: 'manuallyProgressEdge';
  data: ManuallyProgressEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<ManuallyProgressEdge>({
  elementType: 'manuallyProgressEdge',
  name: 'ManualProgress',
  propertiesComponent: ManuallyProgressEdgeProperties,
  elementComponent: ReactFlowSmartBezierEdgePassFail,
  defaultData: {
    ...defaultPolyglotEdgeData,
    conditionKind: 'pass',
  },
  transformData: (edge) => {
    const code = `
async Task<(bool, string)> validate(PolyglotValidationContext context) {
    var getMultipleChoiceAnswer = () => {
        var submitted = context.JourneyContext.EventsProduced.OfType<ReturnValueProduced>().FirstOrDefault()?.Value as HashSet<string>;
        var answersCorrect = ((List<object>)context.Exercise.Data.isChoiceCorrect).Select((c, i) => (c, i))
                                                                                .Where(c => bool.Parse(c.c.ToString()))
                                                                                .Select(c => (c.i + 1).ToString())
                                                                                .ToHashSet();
        return submitted.SetEquals(answersCorrect);
    };

    var isSubmissionCorrect = context.Exercise.NodeType switch
    {
        "multipleChoiceQuestionNode" => getMultipleChoiceAnswer(),
        _ => context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode),
    };

    var conditionKind = context.Condition.Data.conditionKind switch
    {
        "pass" => true,
        "fail" => false,
        _ => throw new Exception("Unknown condition kind")
    };
    return (conditionKind == isSubmissionCorrect, "Pass/Fail edge");
}    
`;

    return {
      ...edge,
      code,
    };
  },
});
