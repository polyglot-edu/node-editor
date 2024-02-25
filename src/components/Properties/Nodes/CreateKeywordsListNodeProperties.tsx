import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CreateKeywordsListNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties platform={['WebApp']} />
      <MarkDownField label="Instructions" name="data.instructions" />
    </>
  );
};

export default CreateKeywordsListNodeProperties;
