import { TextField, Toggle } from '@fluentui/react';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const FindSolutionNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties />
      <MarkDownField label="Text" name="data.text" />
      <TextField label="URL" name="data.link" />
      <Toggle label="Learners upload?" />
    </>
  );
};

export default FindSolutionNodeProperties;
