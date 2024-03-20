import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const BrainstormingNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to complete a sentence with the
        appropriate word or phrase
      </div>
      <br />
      <NodeProperties platform={['WebApp']} />
      <MarkDownField label="Goal" name="data.goal" />
      <MarkDownField label="Instructions" name="data.instructions" />
      <EnumField
        label="Group Number"
        name="group"
        width="50%"
        constraints={{ valueAsNumber: true }}
        options={
          <>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </>
        }
      />
      <EnumField
        label="Collaborative Tool"
        name="data.collaborativeTool"
        width="50%"
        options={
          <>
            <option value={'Miroboard'}>Miroboard</option>
            <option value={'Altro'}>Altro</option>
          </>
        }
      />
    </>
  );
};

export default BrainstormingNodeProperties;
