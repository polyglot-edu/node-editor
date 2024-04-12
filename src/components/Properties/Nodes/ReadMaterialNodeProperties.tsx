import { Button, useDisclosure } from '@chakra-ui/react';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import AIToolModal from '../../Modals/AIToolModal';
import NodeProperties from './NodeProperties';

const ReadMaterialNodeProperties = () => {
  const {
    isOpen: isOpenAITool,
    onOpen: onOpenAITool,
    onClose: onCloseAITool,
  } = useDisclosure();
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        Insert a document URL, input text directly, or or add an existing OER
      </div>
      <br />
      <NodeProperties
        platform={['WebApp']}
        activityDescription="Insert a document URL, input text directly, or or add an existing OER"
      />
      <AIToolModal
        isOpen={isOpenAITool}
        onClose={onCloseAITool}
        exType={'ReadMaterialNode'}
      />
      <Button marginBottom={'5px'} id="buttonAI" onClick={onOpenAITool}>
        Create with AI
      </Button>
      <MarkDownField label="Text" name="data.text" />
      <TextField label="URL" name="data.link" />
    </>
  );
};

export default ReadMaterialNodeProperties;
