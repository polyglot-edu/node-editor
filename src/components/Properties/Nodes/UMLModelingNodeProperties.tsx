import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const UMLModelingNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['PapyrusWeb']}
        activityDescription="In this activity learners will have solve an assignment of UML class activity."
      />
      <MarkDownField label="Assignment" name="data.assignment" />
      <TextField label="Project Name" name="data.projectUML"></TextField>
      <TextField label="idUML" name="data.idUML"></TextField>

      <EnumField
        label="Modality"
        name="data.typeExercise"
        constraints={{ valueAsNumber: false }}
        options={
          <>
            <option value={'BankAccount.domain_model'}>
              Bank Account context
            </option>
            <option value={'CarMaintenance.domain_model'}>
              Car Maintenance context
            </option>
          </>
        }
      />
    </>
  );
};

export default UMLModelingNodeProperties;
