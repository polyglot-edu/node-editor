import { useState } from 'react';
import CodeField from '../../Forms/Fields/CodeField';
import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const PromptEngineeringNodeProperties = () => {
  const [language, setLanguage] = useState('csharp');
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="In this activity learners will have to complete a prompt engineering
        exercise"
      />
      <MarkDownField label="Question" name="data.question" />
      <CodeField
        label="Template code"
        name="data.codeTemplate"
        language={language}
      />
      <EnumField
        label="Language"
        name="data.language"
        constraints={{ onChange: (event) => setLanguage(event.target.value) }}
        options={
          <>
            <option value="csharp">csharp</option>
            <option value="sysml">sysml</option>
          </>
        }
      />
    </>
  );
};

export default PromptEngineeringNodeProperties;
