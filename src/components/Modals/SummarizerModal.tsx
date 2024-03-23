import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../data/api';
import MarkDownField from '../Forms/Fields/MarkDownField';
import TextField from '../Forms/Fields/TextField';

export type ModelTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SummarizerModal = ({ isOpen, onClose }: ModelTemplateProps) => {
  const [generatingLoading, setGeneratingLoading] = useState(false);

  const { getValues, setValue } = useFormContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function toast(arg0: {
    title: string;
    description: string;
    status: string;
    duration: number;
    position: string;
    isClosable: boolean;
  }) {
    throw new Error('Function not implemented.');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Do you need help to summarize your material?</ModalHeader>
        <ModalBody>
          <Text>Submit your material in this box to use our summirizer.</Text>
          <Button
            marginBottom={'5px'}
            marginTop={'5px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                const material = getValues('sourceMaterial');
                const level = getValues('level');
                const noW = getValues('noW');
                if (!material) {
                  setValue('data.question', 'No text given');
                  //
                  throw ': no text given';
                }

                const response: AxiosResponse = await API.summarizerAI({
                  lesson: material,
                  level: level,
                  noW: noW,
                });
                setValue('generatedMaterial', response.data);
                setGeneratingLoading(false);
              } catch (error) {
                setGeneratingLoading(false);
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                toast({
                  title: 'Internal Error',
                  description: 'Try later' + (error as Error),
                  status: 'error',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
              }
            }}
            isLoading={generatingLoading}
          >
            Generate question
          </Button>
          <TextField label="Source material" name="sourceMaterial" isTextArea />
          <MarkDownField
            label="Generated question (editable)"
            name="generatedMaterial"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SummarizerModal;
