import { PolyglotNode, PolyglotEdge, MultipleChoiceNode } from "../types/polyglotElements";
import { v4 as UUIDv4 } from 'uuid';

const multiple: MultipleChoiceNode[] = [
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Default',
        description: 'Some description',
        data: { label: 'Default Node', options: ["Option 1", "Option 2", "Option 3"] },
        position: { x: 100, y: 125 },
    },
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Input',
        description: 'Some description',
        data: { label: 'Input Node', options: ["Option test"] },
        position: { x: 250, y: 25 },
    },
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Output',
        description: 'Some description',
        data: { label: 'Output Node', options: ["Option 11233444"] },
        position: { x: 250, y: 250 },
    },
    {
        id: UUIDv4(),
        type: "multipleChoiceNode",
        title: 'Multiple Choice',
        description: 'Some description',
        data: { label: 'Multiple Choice Node', options: ["Option 1 Option 2"] },
        position: { x: 100, y: 250 },
    },
]

const flowElements: PolyglotNode[] = [
    ...multiple,
    {
        id: UUIDv4(),
        type: "codingNode",
        title: 'Coding',
        description: 'Some description',
        data: { label: 'Coding Node' },
        position: { x: 600, y: 650 },
    },
    {
        id: UUIDv4(),
        type: "codingNode",
        title: 'Other Coding',
        description: 'Some description',
        data: { label: 'Coding Node' },
        position: { x: 700, y: 850 },
    }
];

const flowEdges: PolyglotEdge[] = [
    // animated edge
    { id: 'e1-2', source: '1', target: '2', type: "default", label: 'Edge 1-2', data: { label: 'Edge 1-2', conditions: [] } },
    { id: 'e2-3', source: '2', target: '3', type: "default", label: 'Edge 2-3', data: { label: 'Edge 2-3', conditions: [] } },
]

const loadFlowElements = () => {
    return Promise.resolve({ nodes: flowElements, edges: flowEdges });
}

export default loadFlowElements