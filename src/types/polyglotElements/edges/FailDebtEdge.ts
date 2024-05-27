import * as t from 'io-ts';
import FailDebtEdgeProperties from '../../../components/Properties/Edges/failDebtEdgeProperties';
import { ReactFlowSmartBezierEdgePassFail } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';
import { TypeOfExercise } from '../AIGenerativeTypes/AIGenerativeTypes';

export const FailDebtEdgeConditionKind_IoTs = t.literal('fail');

type FailDebtEdgeConditionKind = t.TypeOf<
  typeof FailDebtEdgeConditionKind_IoTs
>;

type Topic = {
  Topic: string;
  Type: TypeOfExercise;
  Description: string;
};

export type FailDebtEdgeData = EdgeData & {
  conditionKind: FailDebtEdgeConditionKind;
  material: string;
  macroSubject: string;
  topic: Topic;
  learningObjective: string;
  title: string;
  language: string;
  level: number;
  temperature: number;
  typeOfExercise: number;
  assignmentType: number;
  bloomLevel: number;
};

export type FailDebtEdge = PolyglotEdge & {
  type: 'failDebtEdge';
  data: FailDebtEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<FailDebtEdge>({
  elementType: 'failDebtEdge',
  name: 'Fail with debt',
  propertiesComponent: FailDebtEdgeProperties,
  elementComponent: ReactFlowSmartBezierEdgePassFail,
  defaultData: {
    ...defaultPolyglotEdgeData,
    conditionKind: 'fail',
    material: '',
    macroSubject: '',
    topic: { Topic: '', Description: 'setup', Type: 0 },
    learningObjective: '',
    title: '',
    language: '',
    level: 2,
    temperature: 0.2,
    typeOfExercise: 0,
    assignmentType: 0,
    bloomLevel: 0,
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
        "fail" => false,
        _ => throw new Exception("Unknown condition kind")
    };
    return (conditionKind == isSubmissionCorrect, "Fail with Debt edge");
}    
`;

    return {
      ...edge,
      code,
    };
  },
});
