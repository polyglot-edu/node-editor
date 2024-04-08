import ArrayField from '../../Forms/Fields/ArrayField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const OpenQuestionNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will answer to an Open Question
      </div>
      <br />
      <NodeProperties platform={['WebApp']} />
      <MarkDownField label="Question" name="data.question" />
      <ArrayField
        label="Correct Answers/validation material"
        name="data.correctAnswers"
        option="Answer"
      />
    </>
  );
};

export default OpenQuestionNodeProperties;
