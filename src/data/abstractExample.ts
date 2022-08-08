import { PolyglotNode, PolyglotEdge, MultipleChoiceQuestionNode, CodingQuestionNode, PassFailEdge, PolyglotFlow } from "../types/polyglotElements";
import { v4 as UUIDv4 } from 'uuid';
import { MarkerType } from "react-flow-renderer";

const subFlow = new Map<string, PolyglotFlow>();

{
    const ids = [...Array(8).keys()].map(i => UUIDv4());

    const multipleChoiceNodes: MultipleChoiceQuestionNode[] = [
        {
            type: "multipleChoiceQuestionNode",
            title: 'Multiple Choice Question',
            description: 'Some description',
            difficulty: 1,
            data: { question: "Test", correctAnswers: [], isChoiceCorrect: [false], choices: ["Choice test"] },
            reactFlow: {
                id: UUIDv4(),
                type: "multipleChoiceQuestionNode",
                position: { x: 150, y: 50 },
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
            data: {},
            reactFlow: {
                id: UUIDv4(),
                type: "codingQuestionNode",
                position: { x: 150, y: 75 },
                data: { label: 'Coding Question' },
            },
        },
    ];

    const flowNodes: PolyglotNode[] = [
        ...multipleChoiceNodes,
        ...codingNodes,
    ];

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

    const flowEdges: PolyglotEdge[] = [
        ...passFailEdges,
    ]

    subFlow.set("1", {
       // id: UUIDv4(),
        id: "ASDFGHJKL",
        title: "Abstract subTree",
        description: "This is an example",
        nodes: flowNodes,
        edges: flowEdges
    })
}
export default subFlow;