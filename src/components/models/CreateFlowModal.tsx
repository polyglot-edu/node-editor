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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { APIV2 } from '../../data/api';
import { PolyglotFlow, PolyglotFlowInfo } from '../../types/polyglotElements';

type CreateFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateFlowModal = ({ isOpen, onClose }: CreateFlowModalProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [flow, setFlow] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const toast = useToast();
  const router = useRouter();
  const API = useMemo(() => new APIV2(), []);

  const createFlow = async () => {
    try {
      let response: AxiosResponse;

      setLoading(true);

      switch (currentTab) {
        case 0:
          const base_Flow: PolyglotFlowInfo = {
            title: title,
            description: description,
          };
          response = await API.createNewFlow(base_Flow);
          break;
        case 1:
          if (!flow) return;
          const poly_flow: PolyglotFlow = JSON.parse(flow);
          response = await API.createNewFlowJson(poly_flow);
          break;
        default:
          console.log('Tab not defined');
          return;
      }

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
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Flow</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs onChange={(index) => setCurrentTab(index)}>
            <TabList>
              <Tab>Custom</Tab>
              <Tab>Import JSON</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
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
              </TabPanel>
              <TabPanel>
                <Editor
                  height={'500px'}
                  language={'json'}
                  value={flow}
                  onChange={(value) => setFlow(value)}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
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
