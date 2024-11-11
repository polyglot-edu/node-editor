import { Button, SkeletonText, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import FileUploadDownload from '../../Forms/Fields/UploadDownloadField';
import AIToolModal from '../../Modals/AIToolModal';
import NodeProperties from './NodeProperties';

const ReadMaterialNodeProperties = () => {
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
        activityDescription="Insert a document URL, input text directly, or or add an existing OER"
      />
      <AIToolModal
        isOpen={isOpenAITool}
        onClose={onCloseAITool}
        exType={'ReadMaterialNode'}
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
        <MarkDownField label="Text" name="data.text" />
        <TextField label="URL" name="data.link" />
        <FileUploadDownload />
      </SkeletonText>
    </>
  );
};

export default ReadMaterialNodeProperties;
