import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import FlowEditor from '../../../components/Editor/FlowEditor';
import { APIV2 } from '../../../data/api';
import useStore from '../../../store';
import { PolyglotFlow } from '../../../types/polyglotElements';

const FlowIndex = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Nullable<string>>(null);
  const router = useRouter();
  const flowId = router.query?.id?.toString();

  const API = useMemo(() => new APIV2(), []);

  useEffect(() => {
    (async () => {
      // if (!flowId) router.replace("/");
      if (!flowId) return;
      setLoading(true);
      setError(null);
      let flow: Nullable<PolyglotFlow> = null;

      // Get the flow from the server
      try {
        const response = await API.loadFlowElementsAsync(flowId ?? '');
        if (response.status === 200) {
          console.log('flow elements loaded 🆗');
          flow = response.data;
        } else {
          console.error('flow elements not loaded 😢');
          setError('Error loading flow elements');
          if (response.status === 404) {
            setError('Flow not found');
          }
        }
      } catch (error) {
        console.error(error);
        setError('Error loading flow elements');

        if ((error as AxiosError).response?.status === 404) {
          setError('Flow not found');
        }
      }

      // Get the flow stored in the localstorage
      // if stored flow has no unsaved changes, load server's flow
      const flow_serialize = localStorage.getItem('flow');
      if (flow_serialize) {
        const store_flow = JSON.parse(flow_serialize)?.state;
        if (
          store_flow.activeFlowInfo &&
          store_flow.currentAction !== store_flow.lastSavedAction
        ) {
          // if the flow stored has a different uuid i stored as a rescue
          if (store_flow.activeFlowInfo._id !== flowId) {
            localStorage.setItem(
              'rescue-' + store_flow.activeFlowInfo._id,
              flow_serialize
            );
            useStore.persist.clearStorage();
          } else {
            setLoading(false);
            return;
          }
        }
      }

      // handle the rescue flow
      const rescue = localStorage.getItem('rescue-' + flowId);
      if (rescue) {
        localStorage.setItem('flow', rescue);
        localStorage.removeItem('rescue-' + flowId);
        await useStore.persist.rehydrate();
        setLoading(false);
        return;
      }

      // load the server's flow in case other flows are not found
      console.log(flow);
      if (flow) useStore.getState().loadFlow(flow);
      setLoading(false);
    })();
  }, [flowId, setLoading, API]);

  return (
    <>
      <FlowEditor mode={'write'} />

      {/* if is error */}
      <Modal
        isOpen={error !== null}
        onClose={() => console.log('Not closed')}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error:</ModalHeader>
          <ModalBody>{error}</ModalBody>
          <ModalFooter>
            <Button
              bg={'red.500'}
              color="white"
              _hover={{ bg: 'red.600' }}
              onClick={() => router.reload()}
            >
              Refresh page
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* if is loading */}
      <Modal
        isOpen={loading}
        onClose={() => console.log('Not closed')}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex align={'center'}>
              <Spinner size={'xl'} mr={5} />
              <Text fontSize={'xl'} fontWeight="bold">
                Loading flow...
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FlowIndex;
