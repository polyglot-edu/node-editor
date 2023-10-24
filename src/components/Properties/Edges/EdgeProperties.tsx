import { useFormContext } from 'react-hook-form';
import { useReactFlow } from 'reactflow';
import { polyglotEdgeComponentMapping } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';

const config= [
  {
    edgeTypes: ["unconditionalEdge"],
    nodeTypes: [
      "lessonTextNode",
      "abstractNode"
    ]
  },
  {
    edgeTypes: [
      "customValidationEdge",
      "exactValueEdge",
      "passFailEdge",    
    ],
    nodeTypes: [
      "multipleChoiceQuestionNode",
      "codingQuestionNode",
      "closeEndedQuestionNode"
    ]
  }
]

export type EdgePropertiesProps = {};
const EdgeProperties = () => {

  const { getValues } = useFormContext();
  const source = getValues('reactFlow.source');
  const sourceType = useReactFlow().getNode(source)?.type;
  let edgesTypes:string[];
  if(config[0].nodeTypes.includes(sourceType||""))
   edgesTypes = config[0].edgeTypes;
  else edgesTypes = config[1].edgeTypes;

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
              .filter((value)=>{
                if(edgesTypes.includes(value)) 
                  return true})
              .map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              )
              )}
          </>
        }
        />
    </>
  );
};

export default EdgeProperties;
