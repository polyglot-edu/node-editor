import { PolyglotNode, PolyglotEdge, MultipleChoiceQuestionNode, CodingQuestionNode, PassFailEdge, LessonNode, CloseEndedQuestionNode } from "../types/polyglotElements";
import { v4 as UUIDv4 } from 'uuid';
import { MarkerType } from "react-flow-renderer";

const id1 = UUIDv4();
const id2 = UUIDv4();

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
    {
        id: id1,
        type: "multipleChoiceQuestionNode",
        title: 'Other Multiple Choice',
        description: 'Some description',
        difficulty: 5,
        data: { label: 'Other Multiple Choice', question: "Test", correctAnswers: [], choices: ["Choice 11233444"] },
        position: { x: 250, y: 375 },
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
    {
        id: id2,
        type: "codingQuestionNode",
        title: 'Other Coding',
        description: 'Some other description',
        difficulty: 3,
        data: { label: 'Other Coding' },
        position: { x: 600, y: 375 },
    }
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
    }
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
        source: id1,
        target: id2,
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

const flowEdges: PolyglotEdge[] = [
    ...passFailEdges,
]

const loadFlowElementsAsync = () => {
    return Promise.resolve({ nodes: flowNodes, edges: flowEdges });
}

export const loadFlowElements = () => {
    return { nodes: flowNodes, edges: flowEdges };
}

export default loadFlowElementsAsync