import { Stack, StackItem, TextField } from '@fluentui/react';
import { PolyglotFlowInfo } from '../../types/polyglotElements';
import {
  eventHandlerFactory,
  textInputEventAdapter,
  updater,
} from '../../utils/formHandling';
import useStore from '../../store';
import Card from '../Card/Card';

export type FlowPropertiesProps = {};

const FlowProperties = () => {
  const [selectedNodeId, selectedEdgeId] = useStore((state) => [
    state.selectedNode,
    state.selectedEdge,
  ]);
  const [activeFlowInfo, updateFlowInfo] = useStore((state) => [
    state.activeFlowInfo,
    state.updateFlowInfo,
  ]);

  if (selectedEdgeId || selectedNodeId) {
    return <></>;
  }
  if (!activeFlowInfo) {
    return <></>;
  }

  const { _id } = activeFlowInfo;

  const genericFlowUpdater = eventHandlerFactory(updateFlowInfo);
  const textInputFlowUpdater = genericFlowUpdater(textInputEventAdapter);

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <StackItem>
        <Card>
          <TextField
            label="Title"
            id={`titleInput-${_id}`}
            value={activeFlowInfo.title}
            onChange={textInputFlowUpdater(
              updater<PolyglotFlowInfo>()('title')
            )}
          />
          <TextField
            label="Description"
            id={`descriptionInput-${_id}`}
            multiline
            autoAdjustHeight
            value={activeFlowInfo.description}
            onChange={textInputFlowUpdater(
              updater<PolyglotFlowInfo>()('description')
            )}
          />
        </Card>
      </StackItem>
    </Stack>
  );
};

export default FlowProperties;
