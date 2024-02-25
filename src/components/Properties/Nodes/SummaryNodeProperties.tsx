import { Toggle } from '@fluentui/react';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const SummaryNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to summarize a given text or
        document
      </div>
      <br />
      <NodeProperties platform={['WebApp']} />
      <MarkDownField label="Text" name="data.text" />
      <TextField label="URL" name="data.link" />
      <Toggle label="Learners upload?" />
    </>
  );
};

export default SummaryNodeProperties;
