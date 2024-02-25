import MarkDownField from '../../Forms/Fields/MarkDownField';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import NodeProperties from './NodeProperties';

const MemoriseKeywordsListNodeProperties = () => {
  return (
    <>
      <div style={{ color: 'red' }}>ATTENTION NODE NOT IMPLEMENTED YET!</div>
      <NodeProperties platform={["WebApp"]}/>
      <MarkDownField label="Instructions" name="data.instructions" />
      <MultipleChoiceField label="Keywords" name="data.keywords" />
    </>
  );
};

export default MemoriseKeywordsListNodeProperties;
