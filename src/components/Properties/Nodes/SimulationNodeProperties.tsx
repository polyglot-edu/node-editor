import ArrayField from '../../Forms/Fields/ArrayField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CloseEndedQuestionNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to complete a sentence with the
        appropriate word or phrase
      </div>
      <br />
      <NodeProperties />
      <MarkDownField label="Question" name="data.question" />
      <ArrayField
        label="Correct Answers"
        name="data.correctAnswers"
        option="Answer"
      />
    </>
  );
};

export default CloseEndedQuestionNodeProperties;
