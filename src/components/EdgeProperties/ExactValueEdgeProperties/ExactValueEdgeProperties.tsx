import { Stack, StackItem, TextField } from '@fluentui/react';
import useStore, { curriedUpdate } from '../../../store';
import { ExactValueEdge } from '../../../types/polyglotElements';
import {
  eventHandlerFactory,
  textInputEventAdapter,
  updater,
} from '../../../utils/formHandling';
import Card from '../../Card/Card';
import { EdgePropertiesProps } from '../EdgeProperties';

export type ExactValueEdgePropertiesProps = EdgePropertiesProps & {};

const ExactValueEdgeProperties = (props: ExactValueEdgePropertiesProps) => {
  const selectedEdge = useStore((state) =>
    state.getSelectedEdge()
  ) as ExactValueEdge;
  const updateEdge = useStore((state) => state.updateEdge);

  const { id } = selectedEdge.reactFlow;

  const genericEdgeUpdater = eventHandlerFactory(curriedUpdate(updateEdge, id));
  const textInputEdgeUpdater = genericEdgeUpdater(textInputEventAdapter);

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <StackItem>
        <Card>
          <TextField
            label="Value"
            id={`valueInput-${id}`}
            value={selectedEdge.data.value}
            placeholder="Value..."
            onChange={textInputEdgeUpdater(
              updater<ExactValueEdge>()('data.value')
            )}
          />
        </Card>
      </StackItem>
    </Stack>
  );
};

export default ExactValueEdgeProperties;
