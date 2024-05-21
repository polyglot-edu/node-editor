import {
  Button,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { API } from '../../data/api';

export type ModelTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
};
let generateButton = false;

const SummarizerModal = ({ isOpen, onClose }: ModelTemplateProps) => {
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [generatedMaterial, setGeneratedMaterial] = useState('');
  const [noW, setNoW] = useState('');
  const toast = useToast();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Do you need help to summarize your material?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Submit your material in this box to use our summirizer.</Text>
          <Button
            marginBottom={'5px'}
            marginTop={'5px'}
            onClick={async () => {
              try {
                if (generateButton) {
                  toast({
                    title: 'Invalid syntax',
                    description:
                      'You have already generated a summary with this setup, please change the source material or the number of words',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                setGeneratingLoading(true);
                const level = 1;
                if (!sourceMaterial) {
                  setGeneratedMaterial('No text given');
                  //
                  throw ': no text given';
                }
                if (!noW) setNoW('200');
                const response: AxiosResponse = await API.summarize({
                  material: sourceMaterial,
                  level: level,
                  numberOfWords: Number(noW),
                });
                setGeneratedMaterial(response.data);
                setGeneratingLoading(false);
              } catch (error: any) {
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
                if (error.response.status)
                  toast({
                    title: 'Generation Error',
                    description:
                      'We are sorry, server was not able to generate the material, please, try with different material. Do not provide pages that are too long (e.g. Wikipedia pages) or too short, as they can not be analyzed correctly',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
              }
            }}
            isLoading={generatingLoading}
          >
            Generate Material
          </Button>
          <FormLabel
            mb={2}
            fontWeight={'bold'}
            title="How many words do you need?"
          >
            Number of words:&nbsp;
            <Input
              maxWidth={'80px'}
              value={noW}
              onChange={(e) => {
                generateButton = false;
                setNoW(e.currentTarget.value);
              }}
            />
          </FormLabel>

          <FormLabel mb={2} fontWeight={'bold'}>
            Your material:
          </FormLabel>
          <Textarea
            maxHeight={'200px'}
            placeholder="Insert your material here..."
            value={sourceMaterial}
            overflowY={'auto'}
            onChange={(e) => {
              generateButton = false;
              setSourceMaterial(e.currentTarget.value);
            }}
          />
          <FormLabel mb={2} fontWeight={'bold'}>
            Generated Material:
          </FormLabel>
          <Textarea
            placeholder="The generated Material will be insert here"
            maxHeight={'200px'}
            value={generatedMaterial}
            onChange={(e) => setGeneratedMaterial(e.currentTarget.value)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SummarizerModal;
