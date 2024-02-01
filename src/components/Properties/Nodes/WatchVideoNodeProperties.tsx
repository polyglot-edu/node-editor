import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const WatchVideoNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will be given a link to watch
      </div>
      <br />
      <NodeProperties />
      <TextField label="URL" name="data.link" />
    </>
  );
};

export default WatchVideoNodeProperties;
