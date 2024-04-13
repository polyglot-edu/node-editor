import { Button, useDisclosure } from '@chakra-ui/react';
import ArrayField from '../../Forms/Fields/ArrayField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';
import AIToolModal from '../../Modals/AIToolModal';

const CloseEndedQuestionNodeProperties = () => {
  const {
    isOpen: isOpenAITool,
    onOpen: onOpenAITool,
    onClose: onCloseAITool,
  } = useDisclosure();
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="In this activity learners will have to complete a sentence with the
        appropriate word or phrase"
      />
      <AIToolModal
        isOpen={isOpenAITool}
        onClose={onCloseAITool}
        exType={'closeEndedQuestionNode'}
      />
      <Button marginBottom={'5px'} id="buttonAI" title='Disabled momentarily'>
        Create with AI
      </Button>
      <MarkDownField label="Question" name="data.question" />
      <ArrayField
        label="Correct Answers"
        name="data.correctAnswers"
        option="Answer"
      />
    </>
  );
};

export default CloseEndedQuestionNodeProperties;
