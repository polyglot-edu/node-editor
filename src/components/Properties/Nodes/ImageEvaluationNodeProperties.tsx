import MarkDownField from '../../Forms/Fields/MarkDownField';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const ImageEvaluationNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties />
      <TextField label="URL" name="data.link" />
      <MarkDownField label="Question" name="data.question" />
      <MultipleChoiceField label="Answers" name="data.answers" />
    </>
  );
};

export default ImageEvaluationNodeProperties;
