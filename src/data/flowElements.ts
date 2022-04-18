import { PolyglotNode, PolyglotEdge, MultipleChoiceNode, CodingNode, PassFailEdge } from "../types/polyglotElements";
import { v4 as UUIDv4 } from 'uuid';

const id1 = UUIDv4();
const id2 = UUIDv4();

const multipleChoiceNodes: MultipleChoiceNode[] = [
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Input',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Input', question: "Test", correctAnswers: [], choices: ["Choice test"] },
        position: { x: 250, y: 0 },
    },
    {
        id: id1,
        type: "multipleChoiceNode",
        title: 'Output',
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

const lessonNodes: PolyglotNode[] = [
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Input',
        description: 'Some description',
        difficulty: 1,
        data: { label: 'Input' },
        position: { x: 250, y: 150 },
    }
]

const flowNodes: PolyglotNode[] = [
    ...multipleChoiceNodes,
    ...codingNodes,
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