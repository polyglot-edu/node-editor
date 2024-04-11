import { Button, useDisclosure } from '@chakra-ui/react';
import ArrayField from '../../Forms/Fields/ArrayField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import AIToolModal from '../../Modals/AIToolModal';
import NodeProperties from './NodeProperties';

const OpenQuestionNodeProperties = () => {
  const {
    isOpen: isOpenAITool,
    onOpen: onOpenAITool,
    onClose: onCloseAITool,
  } = useDisclosure();
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="In this activity learners will answer to an Open Question"
      />
      <AIToolModal
        isOpen={isOpenAITool}
        onClose={onCloseAITool}
        exType={'OpenQuestionNode'}
      />
      <Button marginBottom={'5px'} id="buttonAI" onClick={onOpenAITool}>
        Create with AI
      </Button>
      <MarkDownField label="Question" name="data.question" />
      <ArrayField
        label="Correct Answers/validation material"
        name="data.correctAnswers"
        option="Answer"
      />
    </>
  );
};

export default OpenQuestionNodeProperties;
