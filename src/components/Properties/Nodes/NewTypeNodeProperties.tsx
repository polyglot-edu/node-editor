import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const NewTypeNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['Eraser']}
        activityDescription="In this activity learners will have solve an assignment of UML class activity."
      />
      <MarkDownField label="Assignment" name="data.assignment" />
      <TextField label="Project Name" name="data.projectUML"></TextField>
      <TextField label="idUML" name="data.idUML"></TextField>
      <div>LINK TO PAPYRUS</div>
      <EnumField
        label="Modality"
        name="data.collaborative"
        constraints={{ valueAsNumber: false }}
        options={
          <>
            <option value={'true'}>Collaborative</option>
            <option value={'false'}>solo activity</option>
          </>
        }
      />
    </>
  );
};

export default NewTypeNodeProperties;
