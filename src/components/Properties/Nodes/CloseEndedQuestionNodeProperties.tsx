import ArrayField from '../../Forms/Fields/ArrayField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CloseEndedQuestionNodeProperties = () => {
  return (
    <>
      <NodeProperties />
      <MarkDownField label="Question" name="data.question" />
      <ArrayField label="Correct Answers" name="data.correctAnswers" />
    </>
  );
};

export default CloseEndedQuestionNodeProperties;
