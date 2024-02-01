import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const ReadMaterialNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        Insert a document URL, input text directly, or or add an existing OER
      </div>
      <br />
      <NodeProperties />
      <div>Material:</div>
      <MarkDownField label="Text" name="data.text" />
      <TextField label="URL" name="data.link" />
    </>
  );
};

export default ReadMaterialNodeProperties;
