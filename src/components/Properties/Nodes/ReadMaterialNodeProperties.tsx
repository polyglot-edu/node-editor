import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const ReadMaterialNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties />
      <div>Material:</div>
      <MarkDownField label="Text" name="data.text" />
      <TextField label="URL" name="data.link" />
    </>
  );
};

export default ReadMaterialNodeProperties;
