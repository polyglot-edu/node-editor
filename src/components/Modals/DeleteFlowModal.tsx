import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

export type ModelTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  flowId: string;
  deleteFunc: (flowId: string) => Promise<void>;
};

const DeleteFlowModal = ({
  isOpen,
  onClose,
  flowId,
  deleteFunc,
}: ModelTemplateProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Learning Path</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure? <br /> This action is irreversable!
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={async () => {
              onClose();
              await deleteFunc(flowId);
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteFlowModal;
