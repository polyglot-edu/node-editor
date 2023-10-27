import { useFormContext } from 'react-hook-form';
import useStore from '../../../store';
import { polyglotEdgeComponentMapping } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';

const config= [
  {
    edgeTypes: ["unconditionalEdge"],
    nodeTypes: [
      "lessonTextNode",
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
      "closeEndedQuestionNode",
      "abstractNode"
    ]
  }
]

export type EdgePropertiesProps = {};
const EdgeProperties = () => {

  const { getValues } = useFormContext();
  const source:string = getValues('reactFlow.source');
  
  const {getSelectedNode, setSelectedNode} = useStore((store) => ({
    getSelectedNode: store.getSelectedNode,
    setSelectedNode: store.setSelectedNode,
  }));
  if(getSelectedNode()?._id!==source)
    setSelectedNode(source);
  const sourceType = getSelectedNode()!.type;
  const edgesTypes=config.find((item)=>{
  if(item.nodeTypes.includes(sourceType||""))
    return true}
  )!.edgeTypes;

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
