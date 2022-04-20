import { PolyglotNode, PolyglotEdge, MultipleChoiceQuestionNode, CodingQuestionNode, PassFailEdge, LessonNode, CloseEndedQuestionNode, ExactValueEdge, UnconditionalEdge, CustomValidationEdge } from "../types/polyglotElements";
import { v4 as UUIDv4 } from 'uuid';
import { MarkerType } from "react-flow-renderer";
import { CustomValidationEdgeProperties } from "../components/EdgeProperties";

const ids = [...Array(8).keys()].map(i => UUIDv4());

const multipleChoiceNodes: MultipleChoiceQuestionNode[] = [
    {
        id: UUIDv4(),
        type: "multipleChoiceQuestionNode",
        title: 'Multiple Choice Question',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Multiple Choice Question', question: "Test", correctAnswers: [], choices: ["Choice test"] },
        position: { x: 250, y: 0 },
    },
]

const codingNodes: CodingQuestionNode[] = [
    {
        id: UUIDv4(),
        type: "codingQuestionNode",
        title: 'Coding Question',
        description: 'Some description',
        difficulty: 4,
        data: { label: 'Coding Question' },
        position: { x: 250, y: 75 },
    },
];

const closeEndedQuestionNodes: CloseEndedQuestionNode[] = [
    {
        id: UUIDv4(),
        type: "closeEndedQuestionNode",
        title: 'Close Ended Question',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Close Ended Question', question: "domandona", correctAnswer: "rispostona" },
        position: { x: 250, y: 150 },
    },
    ...ids.map((id, index) => ({
            id: id,
            type: "closeEndedQuestionNode",
            title: ((index % 2) ? 'To' : 'From'),
            description: 'Some description',
            difficulty: 5,
            data: { label: ((index % 2) ? 'To' : 'From'), question: "domandona", correctAnswer: "rispostona" },
            position: { x: ((index % 2) ? 600 : 250), y: 375 + (Math.floor(index/2) * 75) },
        } as CloseEndedQuestionNode)),
]

const lessonNodes: LessonNode[] = [
    {
        id: UUIDv4(),
        type: "lessonNode",
        title: 'Lesson',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Lesson' },
        position: { x: 250, y: 225 },
    }
]

const flowNodes: PolyglotNode[] = [
    ...multipleChoiceNodes,
    ...codingNodes,
    ...closeEndedQuestionNodes,
    ...lessonNodes,
];

const passFailEdges: PassFailEdge[] = [
    {
        id: UUIDv4(),
        source: ids[0],
        target: ids[1],
        title: 'Pass/Fail',
        type: "passFailEdge",
        data: {
            conditionKind: "pass",
        },
        markerEnd: {
            type: MarkerType.Arrow,
            width: 25,
            height: 25,
        }
    },
]

const exactValueEdges: ExactValueEdge[] = [
    {
        id: UUIDv4(),
        source: ids[2],
        target: ids[3],
        title: 'Exact Value',
        type: "exactValueEdge",
        data: {
            value: "Expected Value",
        },
        markerEnd: {
            type: MarkerType.Arrow,
            width: 25,
            height: 25,
        }
    },
]

const unconditionalEdge: UnconditionalEdge[] = [
    {
        id: UUIDv4(),
        source: ids[4],
        target: ids[5],
        title: 'Unconditional',
        type: "unconditionalEdge",
        data: {},
        markerEnd: {
            type: MarkerType.Arrow,
            width: 25,
            height: 25,
        }
    },
]

const customValidationEdge: CustomValidationEdge[] = [
    {
        id: UUIDv4(),
        source: ids[6],
        target: ids[7],
        title: 'Custom Validation',
        type: "customValidationEdge",
        data: {
            code: `bool validate(context) {
    return context.answer == 'expected answer';
}`,
        },
        markerEnd: {
            type: MarkerType.Arrow,
            width: 25,
            height: 25,
        }
    },
]

const flowEdges: PolyglotEdge[] = [
    ...passFailEdges,
    ...exactValueEdges,
    ...unconditionalEdge,
    ...customValidationEdge,
]

const loadFlowElementsAsync = () => {
    return Promise.resolve({ nodes: flowNodes, edges: flowEdges });
}

export const loadFlowElements = () => {
    return { nodes: flowNodes, edges: flowEdges };
}

export default loadFlowElementsAsync