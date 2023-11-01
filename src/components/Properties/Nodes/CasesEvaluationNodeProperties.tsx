import MarkDownField from '../../Forms/Fields/MarkDownField';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import NodeProperties from './NodeProperties';

const CasesEvaluationNodeProperties = () => {
  return (
    <>
      <NodeProperties />
      <MarkDownField label="Question" name="data.question" />
      <MultipleChoiceField label="Choices" name="data.choices" />
    </>
  );
};

export default CasesEvaluationNodeProperties;
