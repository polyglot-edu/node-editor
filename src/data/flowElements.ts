import { PolyglotNode, PolyglotEdge, MultipleChoiceNode } from "../types/polyglotElements";
import { v4 as UUIDv4 } from 'uuid';

const id1 = UUIDv4();
const id2 = UUIDv4();

const multiple: MultipleChoiceNode[] = [
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Default',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Default', question: "Test", correctAnswers: [], choices: ["Choice 1", "Choice 2", "Choice 3"] },
        position: { x: 100, y: 125 },
    },
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Input',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Input', question: "Test", correctAnswers: [], choices: ["Choice test"] },
        position: { x: 250, y: 25 },
    },
    {
        id: id1,
        type: "multipleChoiceNode",
        title: 'Output',
        description: 'Some description',
        difficulty: 5,
        data: { label: 'Output', question: "Test", correctAnswers: [], choices: ["Choice 11233444"] },
        position: { x: 250, y: 250 },
    },
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Multiple Choice',
        description: 'Some description',
        difficulty: 4,
        data: { label: 'Multiple Choice', question: "Test", correctAnswers: [], choices: ["Choice 1 Choice 2"] },
        position: { x: 100, y: 250 },
    },
]

const flowNodes: PolyglotNode[] = [
    ...multiple,
    {
        id: UUIDv4(),
        type: "codingNode",
        title: 'Coding',
        description: 'Some description',
        difficulty: 4,
        data: { label: 'Coding' },
        position: { x: 600, y: 650 },
    },
    {
        id: id2,
        type: "codingNode",
        title: 'Other Coding',
        description: 'Some other description',
        difficulty: 3,
        data: { label: 'Other Coding' },
        position: { x: 600, y: 350 },
    }
];

const flowEdges: PolyglotEdge[] = [
    // animated edge
    {
        id: UUIDv4(),
        title: "second",
        source: id1,
        target: id2,
        type: "passFailEdge",
        data: {
            // label: "Animated Edge"
        },
    }
    // { id: 'e1-2', source: '1', target: '2', type: "default", label: 'Edge 1-2', data: { label: 'Edge 1-2', conditions: [] } },
    // { id: 'e2-3', source: '2', target: '3', type: "default", label: 'Edge 2-3', data: { label: 'Edge 2-3', conditions: [] } },
]

const loadFlowElementsAsync = () => {
    return Promise.resolve({ nodes: flowNodes, edges: flowEdges });
}

export const loadFlowElements = () => {
    return { nodes: flowNodes, edges: flowEdges };
}

export default loadFlowElementsAsync