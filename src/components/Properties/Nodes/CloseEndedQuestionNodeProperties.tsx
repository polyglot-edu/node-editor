import { Button, Skeleton, SkeletonText, useDisclosure } from '@chakra-ui/react';
import ArrayField from '../../Forms/Fields/ArrayField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import AIToolModal from '../../Modals/AIToolModal';
import NodeProperties from './NodeProperties';
import { useState } from 'react';

const CloseEndedQuestionNodeProperties = () => {
  const {
    isOpen: isOpenAITool,
    onOpen: onOpenAITool,
    onClose: onCloseAITool,
  } = useDisclosure();
  const [generatingLoading, setGeneratingLoading] = useState(false);
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
        action={setGeneratingLoading}
      />
      <Button marginBottom={'5px'} id="buttonAI" title="Disabled momentarily">
        Create with AI
      </Button>
      <SkeletonText
        noOfLines={4}
        spacing="4"
        skeletonHeight="2"
        isLoaded={!generatingLoading}
      >
      <MarkDownField label="Question" name="data.question" />
      </SkeletonText>
      <SkeletonText
        paddingTop={'5px'}
        noOfLines={2}
        spacing="8"
        skeletonHeight="10"
        isLoaded={!generatingLoading}
      >
      <ArrayField
        label="Correct Answers"
        name="data.correctAnswers"
        option="Answer"
      />
      </SkeletonText>
    </>
  );
};

export default CloseEndedQuestionNodeProperties;
