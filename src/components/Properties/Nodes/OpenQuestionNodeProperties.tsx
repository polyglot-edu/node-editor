import { Button, SkeletonText, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import AIToolModal from '../../Modals/AIToolModal';
import NodeProperties from './NodeProperties';

const OpenQuestionNodeProperties = () => {
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
        activityDescription="In this activity learners will answer to an Open Question"
      />
      <AIToolModal
        isOpen={isOpenAITool}
        onClose={onCloseAITool}
        exType={'OpenQuestionNode'}
        action={setGeneratingLoading}
      />
      <Button
        marginBottom={'5px'}
        id="buttonAI"
        onClick={() => {
          setGeneratingLoading(true);
          onOpenAITool();
        }}
      >
        Create with AI
      </Button>
      <SkeletonText
        noOfLines={8}
        spacing="4"
        skeletonHeight="2"
        isLoaded={!generatingLoading}
      >
        <MarkDownField label="Question" name="data.question" />
        <br />
        <MarkDownField
          label="Correct Answers/validation material"
          name="data.possibleAnswer"
        />
      </SkeletonText>
    </>
  );
};

export default OpenQuestionNodeProperties;
