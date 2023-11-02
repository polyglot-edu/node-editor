import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const WatchVideoNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties />
      <TextField label="URL" name="data.link" />
    </>
  );
};

export default WatchVideoNodeProperties;
