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
                setGeneratingLoading(true);
                const level = '0';
                if (!sourceMaterial) {
                  setGeneratedMaterial('No text given');
                  //
                  throw ': no text given';
                }
                if (!noW) setNoW('200');
                if (generatedMaterial != 'enable')
                  throw ': you are not enabled';
                const response: AxiosResponse = await API.summarizerAI({
                  lesson: sourceMaterial,
                  level: level,
                  noW: noW,
                });
                setGeneratedMaterial(response.data);
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
              onChange={(e) => setNoW(e.currentTarget.value)}
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
              setGeneratingLoading(false);
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
