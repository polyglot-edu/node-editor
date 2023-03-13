import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const AbstractNodeProperties = () => {
  return (
    <>
      <NodeProperties />
      <TextField label="Concept" name="concept" />
    </>
  );
};

export default AbstractNodeProperties;
