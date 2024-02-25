import { useState } from 'react';
import CodeField from '../../Forms/Fields/CodeField';
import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CodingQuestionNodeProperties = () => {
  const [language, setLanguage] = useState('csharp');
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to complete a coding exercise
      </div>
      <br />
      <NodeProperties platform={["VSCode"]}/>
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

export default CodingQuestionNodeProperties;
