import { Button, useDisclosure } from '@chakra-ui/react';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import TextField from '../../Forms/Fields/TextField';
import AIToolModal from '../../Modals/AIToolModal';
import NodeProperties from './NodeProperties';

const MultipleChoiceQuestionNodeProperties = () => {
  const {
    isOpen: isOpenAITool,
    onOpen: onOpenAITool,
    onClose: onCloseAITool,
  } = useDisclosure();
  // todo: unregister the paramete
  return (
    <>
      <NodeProperties
        platform={['WebApp', 'VSCode']}
        activityDescription="In this activity learners will have to select the correct answer from
        multiple options provided"
      />
      <AIToolModal
        isOpen={isOpenAITool}
        onClose={onCloseAITool}
        exType={'multipleChoiceQuestionNode'}
      />
      <Button marginBottom={'5px'} id="buttonAI" onClick={onOpenAITool}>
        Create with AI
      </Button>
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
