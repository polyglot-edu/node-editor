import ArrayField from '../../Forms/Fields/ArrayField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const OpenQuestionNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="In this activity learners will answer to an Open Question"
      />
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
