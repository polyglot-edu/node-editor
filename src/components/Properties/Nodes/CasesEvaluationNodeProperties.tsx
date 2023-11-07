import { Toggle } from '@fluentui/react';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const CasesEvaluationNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties />
      <MarkDownField label="Instructions" name="data.guidelines" />
      <MarkDownField label="Text" name="data.text" />
      <TextField label="URL" name="data.link" />
      <Toggle label="Learners upload?" />
    </>
  );
};

export default CasesEvaluationNodeProperties;
