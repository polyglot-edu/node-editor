import { useFormContext } from 'react-hook-form';
import useStore from '../../../store';
import { polyglotEdgeComponentMapping } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';

const config = [
  {
    edgeTypes: ['unconditionalEdge'],
    nodeTypes: [
      'lessonTextNode',
      'WatchVideoNode',
      'ReadMaterialNode',
      'MindMapNode',
      'SummaryNode',
      'ProblemSolvingNode',
      'FindSolutionNode',
    ],
  },
  {
    edgeTypes: ['customValidationEdge', 'exactValueEdge', 'passFailEdge'],
    nodeTypes: [
      'multipleChoiceQuestionNode',
      'codingQuestionNode',
      'closeEndedQuestionNode',
      'abstractNode',
      'TrueFalseNode',
      'ImageEvaluationNode',
      'CasesEvaluationNode',
      'InnovationPitchNode',
    ],
  },
];

export type EdgePropertiesProps = {};
const EdgeProperties = () => {
  const { getValues } = useFormContext();
  const source: string = getValues('reactFlow.source');

  const { nodeMap } = useStore();

  const node = nodeMap.get(source);

  const edgesTypes =
    config.find((item) => item.nodeTypes.includes(node?.type ?? ''))
      ?.edgeTypes ?? [];

  return (
    <>
      <TextField
        label="Title"
        name="title"
        constraints={{
          required: 'Title is required',
        }}
      />
      <EnumField
        label="Type"
        name="type"
        options={
          <>
            {Object.keys(polyglotEdgeComponentMapping.nameMapping)
              .filter((value) => edgesTypes.includes(value))
              .map((value, index) => (
                <option key={index} value={value} selected>
                  {value}
                </option>
              ))}
          </>
        }
      />
    </>
  );
};

export default EdgeProperties;
