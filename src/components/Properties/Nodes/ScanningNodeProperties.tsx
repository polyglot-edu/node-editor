import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const ScanningNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['MuNDAR']}
        activityDescription="In this activity learners will have to scan their material according to the assignment"
      />
      <MarkDownField label="Text" name="data.text" />
    </>
  );
};

export default ScanningNodeProperties;
