import { Modal, Spinner, SpinnerSize, Text, useTheme } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import useStore from '../../../store';
import AppMain from '../../../components/AppMain/AppMain';
import { AxiosError, AxiosResponse } from 'axios';
import { PolyglotFlow } from '../../../types/polyglotElements';
import { useRouter } from 'next/router';
import { API } from '../../../data/api';

type AppFlowProviderProps = {
  fetchFunction: (flowId: string) => Promise<AxiosResponse<PolyglotFlow>>;
  canSaveFlow?: boolean;
};

const AppFlowProvider = ({ canSaveFlow = true }: AppFlowProviderProps) => {
  const [isLoading, setLoading] = useBoolean(false);
  const [error, setError] = useState<Nullable<string>>(null);
  const theme = useTheme();
  const router = useRouter();
  const flowId = router.query.id?.toString();

  useEffect(() => {
    if (!flowId) return;
    (async () => {
      // if (!flowId) router.replace("/");
      setLoading.setTrue();
      setError(null);
      try {
        const flowElements = await API.loadFlowElementsAsync(flowId);
        if (flowElements.status === 200) {
          console.log('flow elements loaded 🆗');
          setLoading.setFalse();
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
      setLoading.setFalse();
    })();
  }, [API.loadExampleFlowElementsAsync, flowId]);

  return (
    <>
      <AppMain canSaveFlow={canSaveFlow} />

      {/* if is error */}
      <Modal
        isBlocking={true}
        isOpen={error !== null}
        containerClassName="flex flex-col flex-nowrap items-stretch"
        scrollableContentClassName="flex flex-1"
      >
        <div
          className="flex flex-1 flex-col justify-center items-center border-0 border-t-4 border-solid"
          style={{ color: theme.palette.red }}
        >
          <Text className="pb-5" variant="xLarge">
            {error}
          </Text>
        </div>
      </Modal>

      {/* if is loading */}
      <Modal
        isBlocking={true}
        isOpen={isLoading}
        containerClassName="flex flex-col flex-nowrap items-stretch"
        scrollableContentClassName="flex flex-1"
      >
        <div
          className="flex flex-1 flex-col justify-center items-center  border-0 border-t-4 border-solid"
          style={{ color: theme.palette.themePrimary }}
        >
          <Text className="pb-5" variant="xLarge">
            Loading flow...
          </Text>
          <Spinner size={SpinnerSize.large} />
        </div>
      </Modal>
    </>
  );
};

export default AppFlowProvider;
