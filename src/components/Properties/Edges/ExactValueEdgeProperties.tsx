import TextField from '../../Forms/Fields/TextField';
import EdgeProperties from './EdgeProperties';

const ExactValueEdgeProperties = () => {
  return (
    <>
      <EdgeProperties />
      <TextField label="Value" name="data.value" />
    </>
  );
};

export default ExactValueEdgeProperties;
