import { TextFieldBase } from '@fluentui/react';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import NodeProperties from './NodeProperties';

const TrueFalseNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties />
      <MarkDownField label="Instructions" name="data.instructions" />
      <span style={{ float: 'left' }}>Positive Points = </span>
      <TextFieldBase
        name="data.positivePoints"
        style={{
          width: '20px',
          height: '20px',
          border: 'solid grey 1px',
          borderRadius: '5px',
        }}
      />
      <span style={{ float: 'left' }}>Negative Points = </span>
      <TextFieldBase
        name="data.negativePoints"
        style={{
          width: '20px',
          height: '20px',
          border: 'solid grey 1px',
          borderRadius: '5px',
        }}
      />
      <MultipleChoiceField label="Questions" name="data.questions" />
    </>
  );
};

export default TrueFalseNodeProperties;
