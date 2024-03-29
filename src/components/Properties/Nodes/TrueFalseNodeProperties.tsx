import TextField from '../../Forms/Fields/TextField';
import TrueFalseField from '../../Forms/Fields/TrueFalseField';
import NodeProperties from './NodeProperties';

const TrueFalseNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to provide answers to true and false
        questions
      </div>
      <br />
      <NodeProperties platform={['WebApp']} />
      <TextField label="Instructions" name="data.instructions" isTextArea />
      <span style={{ float: 'right' }}>
        <TextField
          label="Negative Points"
          name="data.negativePoints"
          width="200px"
        />
      </span>
      <TextField
        label="Positive Points"
        name="data.positivePoints"
        width="200px"
      />
      <TrueFalseField
        label="Questions"
        name="data.questions"
        option="Question"
      />
    </>
  );
};

export default TrueFalseNodeProperties;
