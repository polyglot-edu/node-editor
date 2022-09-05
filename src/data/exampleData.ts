import { PolyglotNode, PolyglotEdge, MultipleChoiceQuestionNode, CodingQuestionNode, PassFailEdge, LessonNode, CloseEndedQuestionNode, ExactValueEdge, UnconditionalEdge, CustomValidationEdge, PolyglotFlow } from "../types/polyglotElements";
import { v4 as UUIDv4 } from 'uuid';
import { MarkerType } from "react-flow-renderer";

const exampleFlows = new Map<string, PolyglotFlow>();

{
    const ids = [...Array(8).keys()].map(i => UUIDv4());

    /*
        NODE EXAMPLE DATA #1:
    
    
    */
    const multipleChoiceNodes: MultipleChoiceQuestionNode[] = [
        {
            type: "multipleChoiceQuestionNode",
            title: 'Multiple Choice Question',
            description: 'Some description',
            difficulty: 1,
            data: { question: "Test", isChoiceCorrect: [false], choices: ["Choice test"] },
            reactFlow: {
                id: UUIDv4(),
                type: "multipleChoiceQuestionNode",
                position: { x: 250, y: 0 },
                data: { label: 'Multiple Choice Question' },

            },
        },
    ]

    const codingNodes: CodingQuestionNode[] = [
        {
            type: "codingQuestionNode",
            title: 'Coding Question',
            description: 'Some description',
            difficulty: 4,
            data: {
                question: "Test",
                codeTemplate: "// some C# code",
                language: "C#",
            },
            reactFlow: {
                id: UUIDv4(),
                type: "codingQuestionNode",
                position: { x: 250, y: 75 },
                data: { label: 'Coding Question' },
            },
        },
    ];

    const closeEndedQuestionNodes: CloseEndedQuestionNode[] = [
        {
            type: "closeEndedQuestionNode",
            title: 'Close Ended Question',
            description: 'Some description',
            difficulty: 1,
            data: { question: "domandona", correctAnswers: ["rispostona"] },
            reactFlow: {
                id: UUIDv4(),
                type: "closeEndedQuestionNode",
                position: { x: 250, y: 150 },
                data: { label: 'Close Ended Question' },
            },
        },
        ...ids.map((id, index) => ({
            type: "closeEndedQuestionNode",
            title: ((index % 2) ? 'To' : 'From'),
            description: 'Some description',
            difficulty: 5,
            data: { question: "domandona", correctAnswers: ["rispostona"] },
            reactFlow: {
                id: id,
                type: "closeEndedQuestionNode",
                position: { x: ((index % 2) ? 600 : 250), y: 375 + (Math.floor(index / 2) * 75) },
                data: { label: ((index % 2) ? 'To' : 'From') },
            },
        } as CloseEndedQuestionNode)),
    ]

    const lessonNodes: LessonNode[] = [
        {
            type: "lessonNode",
            title: 'Lesson',
            description: 'Some description',
            difficulty: 1,
            data: {},
            reactFlow: {
                id: UUIDv4(),
                type: "lessonNode",
                position: { x: 250, y: 225 },
                data: { label: 'Lesson' },
            },
        }
    ]

    const flowNodes: PolyglotNode[] = [
        ...multipleChoiceNodes,
        ...codingNodes,
        ...closeEndedQuestionNodes,
        ...lessonNodes,
    ];




    /*
        EDGE EXAMPLE DATA #1:
    
    
    */

    const passFailEdges: PassFailEdge[] = [
        {
            title: 'Pass/Fail',
            type: "passFailEdge",
            data: {
                conditionKind: "pass",
            },
            reactFlow: {
                id: UUIDv4(),
                source: ids[0],
                target: ids[1],
                type: "passFailEdge",
                markerEnd: {
                    type: MarkerType.Arrow,
                    width: 25,
                    height: 25,
                }
            },
        },
    ]

    const exactValueEdges: ExactValueEdge[] = [
        {
            title: 'Exact Value',
            type: "exactValueEdge",
            data: {
                value: "Expected Value",
            },
            reactFlow: {
                id: UUIDv4(),
                source: ids[2],
                target: ids[3],
                type: "exactValueEdge",
                markerEnd: {
                    type: MarkerType.Arrow,
                    width: 25,
                    height: 25,
                }
            },
        },
    ]

    const unconditionalEdge: UnconditionalEdge[] = [
        {
            title: 'Unconditional',
            type: "unconditionalEdge",
            data: {},
            reactFlow: {
                id: UUIDv4(),
                source: ids[4],
                target: ids[5],
                type: "unconditionalEdge",
                markerEnd: {
                    type: MarkerType.Arrow,
                    width: 25,
                    height: 25,
                }
            },
        },
    ]

    const customValidationEdge: CustomValidationEdge[] = [
        {
            title: 'Custom Validation',
            type: "customValidationEdge",
            data: {
                code: `bool validate(context) {
                    return context.answer == 'expected answer';
                }`,
            },
            reactFlow: {
                id: UUIDv4(),
                source: ids[6],
                target: ids[7],
                type: "customValidationEdge",
                markerEnd: {
                    type: MarkerType.Arrow,
                    width: 25,
                    height: 25,
                }
            },
        },
    ]

    const flowEdges: PolyglotEdge[] = [
        ...passFailEdges,
        ...exactValueEdges,
        ...unconditionalEdge,
        ...customValidationEdge,
    ]

    exampleFlows.set("1", {
        id: UUIDv4(),
        title: "Example Flow #1",
        description: "This is an example flow",
        nodes: flowNodes,
        edges: flowEdges
    })
}

export default exampleFlows;