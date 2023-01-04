import MarkDownField from '../../Forms/Fields/MarkDownField';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import NodeProperties from './NodeProperties';

const MultipleChoiceQuestionNodeProperties = () => {
  return (
    <>
      <NodeProperties />
      <MarkDownField label="Question" name="data.question" />
      <MultipleChoiceField label="Choices" name="data.choices" />
    </>
  );
};

export default MultipleChoiceQuestionNodeProperties;
