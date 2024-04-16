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
      <NodeProperties
        platform={['WebApp', 'VSCode']}
        activityDescription="In this activity learners will have to select the correct answer from
        multiple options provided"
      />
      <TextField label="Question" name="data.question" isTextArea />
      <MultipleChoiceField
        label="Choices"
        name="data.choices"
        option="Answer"
      />
    </>
  );
};

export default MultipleChoiceQuestionNodeProperties;
