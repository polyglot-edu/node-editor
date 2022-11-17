import {
  ArrowBackIcon,
  ArrowForwardIcon,
  CopyIcon,
  EditIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import brandLogo from '../../public/solo_logo.png';
import useStore from '../../store';
import Nav from '../Layout/NavBar';
type EditorNavProps = {
  saveFunc: () => Promise<AxiosResponse<any, any> | undefined>;
};

const DropDown = ({
  name,
  options,
}: {
  name: string;
  options: { name: string; icon?: React.ReactElement; onClick?: () => void }[];
}) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Button
        p={0}
        color="gray.600"
        bg={isOpen ? 'gray.300' : 'transparent'}
        _hover={{ bg: 'gray.300' }}
        onClick={() => onToggle()}
      >
        {name}
      </Button>
      <Box
        shadow={'lg'}
        position={'fixed'}
        bg="white"
        hidden={!isOpen}
        rounded="md"
        roundedTopLeft={'none'}
        zIndex={10}
      >
        {options.map((val, id) => (
          <Box
            key={id}
            color="black"
            bg={'transparent'}
            p={2}
            _hover={{ bg: 'gray.200' }}
            onClick={() => {
              val.onClick?.();
              onToggle();
            }}
          >
            {val?.icon}
            {val.name}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default function EditorNav({ saveFunc }: EditorNavProps) {
  const flow = useStore.getState().getFlow();
  const toast = useToast();
  const [saveLoading, setSaveLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Nav p={2} bg="gray.200" justify="start">
      <Image
        src={brandLogo.src}
        width={['30px']}
        className="mr-3"
        alt="Polyglot Logo"
      />
      <Stack align="start">
        <HStack spacing={2}>
          <Tooltip label="Back">
            <ArrowBackIcon
              w={6}
              h={6}
              color="blue.500"
              onClick={() => console.log('Not implemented')}
            />
          </Tooltip>
          <Tooltip label="Forward">
            <ArrowForwardIcon
              w={6}
              h={6}
              color="blue.500"
              onClick={() => console.log('Not implemented')}
            />
          </Tooltip>
          <Spinner color="blue.500" hidden={!saveLoading} />
          <Tooltip label="Save" hidden={saveLoading}>
            <CopyIcon
              w={6}
              h={6}
              color="blue.500"
              onClick={async () => {
                try {
                  setSaveLoading(true);
                  const resp = await saveFunc();
                  if (resp?.status === 200) {
                    toast({
                      title: 'Flow saved',
                      description: 'The save was successful',
                      status: 'success',
                      duration: 3000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                  } else {
                    toast({
                      title: 'Flow not saved',
                      description: 'Something is off with your flow!',
                      status: 'warning',
                      duration: 3000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                  }
                } catch (err) {
                  toast({
                    title: 'Flow not saved',
                    description: 'Internal error',
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                } finally {
                  setSaveLoading(false);
                }
              }}
            />
          </Tooltip>
          <DropDown
            name="File"
            options={[
              {
                name: 'Save',
                icon: <CopyIcon mr={2} />,
                onClick: async () => {
                  try {
                    const resp = await saveFunc();
                    if (resp?.status === 200) {
                      toast({
                        title: 'Flow saved',
                        description: 'The save was successful',
                        status: 'success',
                        duration: 3000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: 'Flow not saved',
                        description: 'Something is off with your flow!',
                        status: 'warning',
                        duration: 3000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                    }
                  } catch (err) {
                    toast({
                      title: 'Flow not saved',
                      description: 'Internal error',
                      status: 'error',
                      duration: 3000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                  }
                },
              },
              {
                name: 'Export to JSON file',
                icon: <ExternalLinkIcon mr={2} />,
                onClick: onOpen,
              },
            ]}
          />
          <DropDown
            name="Project"
            options={[{ name: 'Edit', icon: <EditIcon mr={2} /> }]}
          />
          <DropDown
            name="Insert"
            options={[
              {
                name: 'Save',
                icon: <CopyIcon mr={2} />,
              },
            ]}
          />
        </HStack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Download JSON flow:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Editor
                height="500px"
                defaultValue={JSON.stringify(flow, null, 2)}
                language="json"
              />
            </ModalBody>

            <ModalFooter>
              <a
                href={URL.createObjectURL(
                  new Blob([JSON.stringify(flow, null, 2)], {
                    type: 'application/json',
                  })
                )}
                download={flow?.title + '.json'}
              >
                <Button colorScheme="blue">Download</Button>
              </a>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </Nav>
  );
}
