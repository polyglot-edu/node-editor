import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const TrueFalseNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to provide answers to true and false
        questions
      </div>
      <br />
      <NodeProperties />
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
      <MultipleChoiceField
        label="Questions"
        name="data.questions"
        option="Question"
      />
    </>
  );
};

export default TrueFalseNodeProperties;
