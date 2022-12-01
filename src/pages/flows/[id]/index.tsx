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
  useDisclosure,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import FlowEditor from '../../../components/Editor/FlowEditor';
import { useUser } from '../../../context/user.context';
import { APIV2 } from '../../../data/api';
import useStore from '../../../store';

const FlowIndex = () => {
  const {
    isOpen: loading,
    onOpen: onLoading,
    onClose: stopLoading,
  } = useDisclosure();
  const { access_token } = useUser();
  const [error, setError] = useState<Nullable<string>>(null);
  const router = useRouter();
  const actions = useStore((state) => state.actions);
  const flowId = router.query?.id?.toString();

  const API = useMemo(() => new APIV2({ access_token }), [access_token]);

  useEffect(() => console.log(actions), [actions]);

  useEffect(() => {
    if (!flowId) return;
    (async () => {
      // if (!flowId) router.replace("/");
      onLoading();
      setError(null);
      try {
        const flowElements = await API.loadFlowElementsAsync(flowId ?? '');
        if (flowElements.status === 200) {
          console.log('flow elements loaded 🆗');
          useStore.getState().loadFlow(flowElements.data);
        } else {
          console.error('flow elements not loaded 😢');
          setError('Error loading flow elements');
          if (flowElements.status === 404) {
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
      stopLoading();
    })();
  }, [flowId, onLoading, stopLoading, API]);

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
