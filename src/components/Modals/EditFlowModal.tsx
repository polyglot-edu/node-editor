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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PolyglotFlow, PolyglotFlowInfo } from '../../types/polyglotElements';

type EditFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  flow: Nullable<PolyglotFlow>;
  updateInfo: (flowInfo: PolyglotFlowInfo) => void;
};

const EditFlowModal = ({
  isOpen,
  onClose,
  flow,
  updateInfo,
}: EditFlowModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!flow) return;
    setTitle(flow.title);
    setDescription(flow.description);
  }, [flow]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Flow</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel mb={2} fontWeight={'bold'}>
              Title:
            </FormLabel>
            <Input
              placeholder="Insert title..."
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <FormLabel mb={2} fontWeight={'bold'}>
              Description:
            </FormLabel>
            <Textarea
              placeholder="Insert description..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              if (!title || !description) return;
              updateInfo({ title: title, description: description });
              onClose();
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditFlowModal;
