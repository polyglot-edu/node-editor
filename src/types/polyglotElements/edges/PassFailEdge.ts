import { polyglotEdgeComponentMapping } from "../elementMapping";
import { PassFailEdgeProperties } from "../../../components/EdgeProperties";
import { ReactFlowSmartBezierEdge } from "../../../components/ReactFlowEdge";
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from "./Edge";
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

polyglotEdgeComponentMapping.registerMapping<PassFailEdge>({
    elementType: "passFailEdge",
    name: "Pass/Fail",
    propertiesComponent: PassFailEdgeProperties,
    elementComponent: ReactFlowSmartBezierEdge,
    defaultData: {
        ...defaultPolyglotEdgeData,
        conditionKind: "pass",
    },
    transformData: (edge) => {
        const code = `
async Task<(bool, string)> validate(PolyglotValidationContext context) {
    var getMultipleChoiceAnswer = () => {
        var index = Int32.Parse(context.JourneyContext.SubmittedCode) - 1;
        var answersCorrect = context.Exercise.Data.isChoiceCorrect;
        return (index >= 0 && index < answersCorrect.Count) ? answersCorrect[index] : false;
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
}`;


        return {
            ...edge,
            code
        };
    },
});