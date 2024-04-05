import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const MultipleChoiceQuestionNodeProperties = () => {
  const [generatingLoading, setGeneratingLoading] = useState(false);

  const { getValues, setValue, unregister } = useFormContext();
  const toast = useToast();
  // todo: unregister the paramete
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to select the correct answer from
        multiple options provided
      </div>
      <br />
      <NodeProperties platform={['WebApp', 'VSCode']} />
      <TextField label="Question" name="data.question" isTextArea />
      <MultipleChoiceField
        label="Choices"
        name="data.choices"
        option="Risposta"
      />
    </>
  );
};

export default MultipleChoiceQuestionNodeProperties;
