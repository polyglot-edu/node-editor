import * as t from 'io-ts';
import PassFailEdgeProperties from '../../../components/Properties/Edges/PassFailEdgeProperties';
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
  type: 'passFailEdge';
  data: PassFailEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<PassFailEdge>({
  elementType: 'passFailEdge',
  name: 'Pass/Fail',
  propertiesComponent: PassFailEdgeProperties,
  elementComponent: ReactFlowSmartBezierEdge,
  defaultData: {
    ...defaultPolyglotEdgeData,
    conditionKind: 'pass',
  },
  transformData: (edge) => {
    const code = `
async Task<(bool, string)> validate(PolyglotValidationContext context) {
    var getMultipleChoiceAnswer = () => {
        var indexes = context.JourneyContext.SubmittedCode.Replace('"'.ToString(), String.Empty)
                                                            .Split(',')
                                                            .Select(n => {
                                                                var parsed = Int32.TryParse(n, out var x);
                                                                if (!parsed) throw new Exception($"""Answer contains non-integer value "{n.Trim()}" in multiple choice question""");
                                                                    return x - 1;
                                                            })
                                                            .Order().ToList();
        var answersCorrect = context.Exercise.Data.isChoiceCorrect.Select((c, i) => (c, i))
                                                                    .Where(c => c.c)
                                                                    .Select(c => c.i)
                                                                    .Order().ToList();

        return Enumerable.SequenceEqual(indexes, answersCorrect);
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
