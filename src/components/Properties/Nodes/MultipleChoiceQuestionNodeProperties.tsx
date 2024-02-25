import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const MultipleChoiceQuestionNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to select the correct answer from
        multiple options provided
      </div>
      <br />
      <NodeProperties platform={["WebApp", "VSCode"]}/>
      <TextField label="Question" name="data.question" isTextArea />
      <MultipleChoiceField
        label="Choices"
        name="data.choices"
        option="Risposta"
      />
    </>
  );
};

export default MultipleChoiceQuestionNodeProperties;
