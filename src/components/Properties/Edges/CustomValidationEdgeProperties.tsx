import CodeField from '../../Forms/Fields/CodeField';
import EdgeProperties from './EdgeProperties';

const CustomValidationEdgeProperties = () => {
  return (
    <>
      <EdgeProperties />
      <CodeField label="Code" name="data.code" language="csharp" />
    </>
  );
};

export default CustomValidationEdgeProperties;
