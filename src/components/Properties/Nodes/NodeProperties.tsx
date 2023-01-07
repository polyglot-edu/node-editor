import { polyglotNodeComponentMapping } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';

export type NodePropertiesProps = {};

const NodeProperties = () => {
  return (
    <>
      <TextField
        label="Title"
        name="title"
        constraints={{
          required: 'Title is required',
        }}
      />
      <TextField label="Description" name="description" isTextArea />
      <EnumField
        label="Difficulty"
        name="difficulty"
        constraints={{ valueAsNumber: true }}
        options={
          <>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </>
        }
      />
      <EnumField
        label="Type"
        name="type"
        options={
          <>
            {Object.keys(polyglotNodeComponentMapping.nameMapping).map(
              (value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              )
            )}
          </>
        }
      />
    </>
  );
};

export default NodeProperties;
