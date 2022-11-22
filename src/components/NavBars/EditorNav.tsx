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
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import brandLogo from '../../public/solo_logo.png';
import useStore from '../../store';
import Nav from '../Layout/NavBar';
type EditorNavProps = {
  saveFunc: () => Promise<void>;
};

const DropDown = ({
  name,
  options,
}: {
  name: string;
  options: {
    name: string;
    shortcut?: string;
    icon?: React.ReactElement;
    onClick?: () => void;
  }[];
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
            <Flex align={'center'}>
              {val?.icon}
              <Text>{val.name}</Text>
              <Spacer minW={10} />
              <Text fontSize={'sm'} fontWeight={'semibold'} color="gray.500">
                {val.shortcut}
              </Text>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default function EditorNav({ saveFunc }: EditorNavProps) {
  const flow = useStore.getState().getFlow();
  const [saveLoading, setSaveLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const isMac =
      typeof window !== 'undefined'
        ? navigator.platform.toUpperCase().indexOf('MAC') >= 0
        : false;

    async function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 's' && (isMac ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        setSaveLoading(true);
        await saveFunc();
        setSaveLoading(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [saveFunc]);

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
            <Button
              disabled={false}
              padding={0}
              background="transparent"
              onClick={async () => {
                setSaveLoading(true);
                await saveFunc();
                setSaveLoading(false);
              }}
            >
              <CopyIcon w={6} h={6} color="blue.500" />
            </Button>
          </Tooltip>
          <DropDown
            name="File"
            options={[
              {
                name: 'Save',
                shortcut: 'Ctrl+S',
                icon: <CopyIcon mr={2} />,
                onClick: async () => {
                  setSaveLoading(true);
                  await saveFunc();
                  setSaveLoading(false);
                },
              },
              {
                name: 'Export JSON',
                shortcut: 'Ctrl+E', // TODO: da implementare se c'è bisogno
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
              {/* <a
                href={URL.createObjectURL(
                  new Blob([JSON.stringify(flow, null, 2)], {
                    type: 'application/json',
                  })
                )}
                download={flow?.title + '.json'}
              > */}
              <Button colorScheme="blue">Download</Button>
              {/* </a> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </Nav>
  );
}
