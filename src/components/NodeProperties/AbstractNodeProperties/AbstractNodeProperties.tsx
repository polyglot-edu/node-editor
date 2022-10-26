import {
  Stack,
  StackItem,
  TextField,
  PrimaryButton,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import useStore, { curriedUpdate } from '../../../store';
import Card from '../../Card/Card';
import { NodePropertiesProps } from '../NodeProperties';
import { AbstractNode } from '../../../types/polyglotElements/nodes/AbstractNode';
import { useBoolean } from '@fluentui/react-hooks';
import { API } from '../../../data/api';
import toast from 'react-hot-toast';
import {
  eventHandlerFactory,
  textInputEventAdapter,
  updater,
} from '../../../utils/formHandling';

export type AbstractNodePropertiesProps = AbstractNode & NodePropertiesProps;

const AbstractNodeProperties = (props: AbstractNodePropertiesProps) => {
  const selectedNode = useStore((state) =>
    state.getSelectedNode()
  ) as AbstractNode;
  const [isLoading, setLoading] = useBoolean(false);

  const updateNode = useStore((state) => state.updateNode);
  const { id } = selectedNode.reactFlow;
  const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
  const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);

  async function generateSubtree() {
    setLoading.setTrue();
    try {
      const apiPromise = API.loadAbstractExampleFlowElementsAsync(
        'example',
        'example'
      );
      toast.promise(apiPromise, {
        loading: 'Generating abstract refinement...',
        success: (response) =>
          response.status === 200
            ? 'Abstract refinement loaded successfully'
            : 'Error generating abstract refinement',
        error: 'Error generating abstract refinement',
      });

      const apiResponse = await apiPromise;
      if (apiResponse.status === 200) {
        const subFlow = apiResponse.data;
        console.log('abstract refinement loaded 🆗');
        setLoading.setFalse();

        // actual subtree update
        useStore.getState().removeNode(id);
        useStore.getState().addSubFlow(subFlow);
        return;
      } else {
        console.error('abstract refinement not loaded 😢');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading.setFalse();
  }

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <StackItem>
        <Card className="flex flex-col">
          <TextField
            label="Select Goal"
            id={`goalInput-${id}`}
            multiline
            autoAdjustHeight
            value={selectedNode.data.target}
            onChange={textInputNodeUpdater(
              updater<AbstractNode>()('data.target')
            )}
          />
          {isLoading ? (
            <PrimaryButton className="mt-4 self-center w-1/2 p-0" disabled>
              <Spinner size={SpinnerSize.medium} />
            </PrimaryButton>
          ) : (
            <PrimaryButton
              className="mt-4 self-center w-1/2 p-0"
              onClick={generateSubtree}
            >
              Generate SubTree
            </PrimaryButton>
          )}
          {/* <PrimaryButton text ='Generate Sub-Tree' className="mt-4 self-center w-1/2 p-0" onClick={generateSubtree}/> */}
        </Card>
      </StackItem>
    </Stack>
  );
};

export default AbstractNodeProperties;
