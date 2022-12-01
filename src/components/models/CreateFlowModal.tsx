import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser } from '../../context/user.context';

type CreateFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateFlowModal = ({ isOpen, onClose }: CreateFlowModalProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const toast = useToast();
  const router = useRouter();
  const { API } = useUser();

  if (!API) return null;

  const createFlow = async () => {
    try {
      setLoading(true);
      const response = await API.createNewFlow({
        title: title,
        description: description,
        nodes: [],
        edges: [],
      });
      if (response.status !== 200) {
        onClose();
        toast({
          title: 'Flow not created',
          description: 'Something is off with your flow!',
          status: 'warning',
          duration: 3000,
          position: 'bottom-left',
          isClosable: true,
        });
      }
      router.push('/flows/' + response.data.id);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Internal Error',
        description: 'Try later',
        status: 'error',
        duration: 3000,
        position: 'bottom-left',
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Flow</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel mb={2} fontWeight={'bold'}>
              Title:
            </FormLabel>
            <Input
              placeholder="Insert title..."
              onChange={(e) => {
                e.preventDefault();
                setTitle(e.currentTarget.value);
              }}
            />
            <FormLabel mb={2} fontWeight={'bold'}>
              Description:
            </FormLabel>
            <Textarea
              placeholder="Insert description..."
              onChange={(e) => {
                e.preventDefault();
                setDescription(e.currentTarget.value);
              }}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            isLoading={loading}
            loadingText="Creating"
            colorScheme="blue"
            onClick={createFlow}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateFlowModal;
