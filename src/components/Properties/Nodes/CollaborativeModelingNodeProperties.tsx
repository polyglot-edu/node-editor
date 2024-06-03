import ArrayField from '../../Forms/Fields/ArrayField';
import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CollaborativeModelingNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['Eraser']}
        activityDescription="In this activity learners will have to collaborate to solve an assignment and create a scheme"
      />
      <MarkDownField label="Assignment" name="data.assignment" />
      <EnumField
        label="Scheme Model"
        name="data.scheme"
        width="50%"
        constraints={{ valueAsNumber: false }}
        options={
          <>
            <option value={'flowChart'}>Flow Chart</option>
            <option value={'cloudArchitecture'}>Cloud Architecture</option>
            <option value={'entityRelationship'}>Entity Relationship</option>
            <option value={'general'}>General Scheme</option>
          </>
        }
      />
    </>
  );
};

export default CollaborativeModelingNodeProperties;
