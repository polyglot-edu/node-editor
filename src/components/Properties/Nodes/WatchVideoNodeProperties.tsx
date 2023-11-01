import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const WatchVideoNodeProperties = () => {
  return (
    <>
      <NodeProperties />
      <MarkDownField label="Text" name="data.text" />
    </>
  );
};

export default WatchVideoNodeProperties;
