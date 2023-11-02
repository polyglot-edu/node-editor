import MarkDownField from '../../Forms/Fields/MarkDownField';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import NodeProperties from './NodeProperties';

const TrueFalseNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties />
      <MarkDownField label="Instructions" name="data.instructions" />
      <MultipleChoiceField label="Questions" name="data.questions" />
    </>
  );
};

export default TrueFalseNodeProperties;
