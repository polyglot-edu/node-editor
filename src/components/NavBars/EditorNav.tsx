import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowRightIcon,
  CloseIcon,
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
  LinkBox,
  LinkOverlay,
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
import { useRouter } from 'next/router';
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
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box>
      <Box
        width="100vw"
        height="100vh"
        position="absolute"
        left={0}
        top={0}
        onClick={onClose}
        zIndex={9}
        hidden={!isOpen}
      />
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
  const [
    checkSave,
    checkForwardAction,
    checkBackAction,
    flow,
    backAction,
    forwardAction,
  ] = useStore((state) => [
    state.checkSave(),
    state.checkForwardAction(),
    state.checkBackAction(),
    state.getFlow(),
    state.backAction,
    state.forwardAction,
  ]);
  const [saveLoading, setSaveLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRun,
    onOpen: onOpenRun,
    onClose: onCloseRun,
  } = useDisclosure();

  const router = useRouter();

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
      <Stack align="start" w="full">
        <HStack w="full">
          <Image
            src={brandLogo.src}
            width={['30px']}
            className="mr-3"
            alt="Polyglot Logo"
          />
          <Tooltip label="Back">
            <Button
              disabled={!checkBackAction}
              padding={0}
              background="transparent"
              onClick={backAction}
            >
              <ArrowBackIcon w={6} h={6} color="blue.500" />
            </Button>
          </Tooltip>
          <Tooltip label="Forward">
            <Button
              disabled={!checkForwardAction}
              padding={0}
              background="transparent"
              onClick={forwardAction}
            >
              <ArrowForwardIcon w={6} h={6} color="blue.500" />
            </Button>
          </Tooltip>
          <Spinner color="blue.500" hidden={!saveLoading} />
          <Tooltip label="Save">
            <Button
              hidden={saveLoading}
              disabled={!checkSave}
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
            name="Run"
            options={[
              {
                name: 'Run on vscode',
                icon: <ArrowRightIcon mr={2} />,
                onClick: onOpenRun,
              },
            ]}
          />
          <DropDown
            name="Project"
            options={[{ name: 'Edit', icon: <EditIcon mr={2} /> }]}
          />
          <Spacer />
          <Button
            leftIcon={<CloseIcon />}
            size="sm"
            colorScheme="red"
            variant="solid"
            onClick={() => {
              router.push('/flows');
            }}
          >
            Leave editor
          </Button>
        </HStack>
      </Stack>
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
      <Modal isOpen={isOpenRun} onClose={onCloseRun}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Run on vscode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Download the generated notebook and open it in vscode</Text>
          </ModalBody>

          <ModalFooter>
            <LinkBox>
              <Button colorScheme="blue">Download</Button>
              <LinkOverlay
                href={`${process.env.BACK_URL}/api/flows/${flow?._id}/run`}
              />
            </LinkBox>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Nav>
  );
}
