import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import {
  CodingQuestionNode,
  MultipleChoiceQuestionNode,
  PassFailEdge,
  PolyglotEdge,
  PolyglotFlow,
  PolyglotNode,
} from '../types/polyglotElements';

// this should be the real data type
// type PlanningGoal = {
//     currentState: string,
//     goal: string
// }
type PlanningGoal = string;
const subFlow = new Map<PlanningGoal, PolyglotFlow>();

{
  const ids = [...Array(2).keys()].map(() => UUIDv4());

  const multipleChoiceNodes: MultipleChoiceQuestionNode[] = [
    {
      _id: UUIDv4(),
      type: 'multipleChoiceQuestionNode',
      title: 'Multiple Choice Question',
      description: 'Some description',
      difficulty: 1,
      data: {
        question: 'Test',
        isChoiceCorrect: [false],
        choices: ['Choice test'],
      },
      reactFlow: {
        id: ids[0],
        type: 'multipleChoiceQuestionNode',
        position: { x: 250, y: 300 },
        data: { label: 'Multiple Choice Question' },
      },
    },
  ];

  const codingNodes: CodingQuestionNode[] = [
    {
      _id: UUIDv4(),
      type: 'codingQuestionNode',
      title: 'Coding Question',
      description: 'Some description',
      difficulty: 4,
      data: {
        question: '',
        codeTemplate: '',
        language: 'csharp',
      },
      reactFlow: {
        id: ids[1],
        type: 'codingQuestionNode',
        position: { x: 500, y: 300 },
        data: { label: 'Coding Question' },
      },
    },
  ];

  const flowNodes: PolyglotNode[] = [...multipleChoiceNodes, ...codingNodes];

  const passFailEdges: PassFailEdge[] = [
    {
      _id: UUIDv4(),
      title: 'Pass/Fail',
      type: 'passFailEdge',
      data: {
        conditionKind: 'pass',
      },
      reactFlow: {
        id: UUIDv4(),
        source: ids[0],
        target: ids[1],
        type: 'passFailEdge',
        markerEnd: {
          type: MarkerType.Arrow,
          width: 25,
          height: 25,
        },
      },
    },
  ];

  const flowEdges: PolyglotEdge[] = [...passFailEdges];

  subFlow.set(
    // {
    //     currentState: "example",
    //     goal: "example",
    // }, {
    'example, example',
    {
      _id: UUIDv4(),
      author: {
        _id: 'dsdsads',
        username: 'Prova Utente',
      },
      tags: [],
      title: 'Abstract subTree',
      description: 'This is an example',
      nodes: flowNodes,
      edges: flowEdges,
    }
  );
}
export default subFlow;
