import {
  Dropdown,
  IDropdownOption,
  Stack,
  StackItem,
  TextField,
} from '@fluentui/react';
import useStore, { changeEdgeType, curriedUpdate } from '../../store';
import {
  PolyglotEdge,
  polyglotEdgeComponentMapping,
} from '../../types/polyglotElements';
import {
  eventHandlerFactory,
  textInputEventAdapter,
  updater,
} from '../../utils/formHandling';
import Card from '../Card/Card';

export type EdgePropertiesProps = {};

const typeDropdownOptions: IDropdownOption[] = Object.entries(
  polyglotEdgeComponentMapping.nameMapping
).map(([key, name]) => ({ key: key, text: name }));

const Properties = () => {
  const selectedEdge = useStore((state) =>
    state.getSelectedEdge()
  ) as PolyglotEdge;
  const updateEdge = useStore((state) => state.updateEdge);

  if (!selectedEdge) {
    return <></>;
  }

  const { id } = selectedEdge.reactFlow;

  const genericEdgeUpdater = eventHandlerFactory(curriedUpdate(updateEdge, id));
  const textInputEdgeUpdater = genericEdgeUpdater(textInputEventAdapter);

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <StackItem>
        <Card>
          <TextField
            label="Title"
            id={`titleInput-${id}`}
            value={selectedEdge.title}
            onChange={textInputEdgeUpdater(updater<PolyglotEdge>()('title'))}
          />
          <Dropdown
            label="Kind"
            id={`typeInput-${id}`}
            placeholder="Select an option"
            options={typeDropdownOptions}
            onChange={(_, option) => {
              changeEdgeType(selectedEdge, option?.key?.toString() ?? '');
            }}
            selectedKey={selectedEdge.type}
          />
        </Card>
      </StackItem>
    </Stack>
  );
};

export default Properties;
