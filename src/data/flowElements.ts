import { PolyglotNode, PolyglotEdge, MultipleChoiceNode, CodingNode, PassFailEdge, LessonNode, SingleChoiceNode } from "../types/polyglotElements";
import { v4 as UUIDv4 } from 'uuid';
import { MarkerType } from "react-flow-renderer";

const id1 = UUIDv4();
const id2 = UUIDv4();

const multipleChoiceNodes: MultipleChoiceNode[] = [
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Multiple Choice Node',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Input', question: "Test", correctAnswers: [], choices: ["Choice test"] },
        position: { x: 250, y: 0 },
    },
    {
        id: id1,
        type: "multipleChoiceNode",
        title: 'Other Multiple Choice',
        description: 'Some description',
        difficulty: 5,
        data: { label: 'Output', question: "Test", correctAnswers: [], choices: ["Choice 11233444"] },
        position: { x: 250, y: 300 },
    },
]

const codingNodes: CodingNode[] = [
    {
        id: UUIDv4(),
        type: "codingNode",
        title: 'Coding',
        description: 'Some description',
        difficulty: 4,
        data: { label: 'Coding' },
        position: { x: 250, y: 75 },
    },
    {
        id: id2,
        type: "codingNode",
        title: 'Other Coding',
        description: 'Some other description',
        difficulty: 3,
        data: { label: 'Other Coding' },
        position: { x: 600, y: 300 },
    }
];

const singleChoiceNodes: SingleChoiceNode[] = [
    {
        id: UUIDv4(),
        type: "singleChoiceNode",
        title: 'Single Choice',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Single Choice', question: "domandona", correctAnswer: "rispostona" },
        position: { x: 250, y: 225 },
    }
]

const lessonNodes: LessonNode[] = [
    {
        id: UUIDv4(),
        type: "lessonNode",
        title: 'Lesson Node',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Lesson Node' },
        position: { x: 250, y: 150 },
    }
]

const flowNodes: PolyglotNode[] = [
    ...multipleChoiceNodes,
    ...codingNodes,
    ...singleChoiceNodes,
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