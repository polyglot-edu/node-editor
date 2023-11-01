import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const FindSolutionNodeProperties = () => {
  return (
    <>
      <NodeProperties />
      <MarkDownField label="Text" name="data.text" />
    </>
  );
};

export default FindSolutionNodeProperties;
