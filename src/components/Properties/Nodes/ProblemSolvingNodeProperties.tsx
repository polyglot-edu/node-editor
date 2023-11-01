import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const ProblemSolvingNodeProperties = () => {
  return (
    <>
      <NodeProperties />
      <MarkDownField label="Text" name="data.text" />
    </>
  );
};

export default ProblemSolvingNodeProperties;
