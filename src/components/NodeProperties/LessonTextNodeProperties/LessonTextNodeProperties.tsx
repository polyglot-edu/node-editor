import { Label, Separator, Stack, StackItem, TextField } from '@fluentui/react';
import useStore, { curriedUpdate } from '../../../store';
import { LessonTextNode } from '../../../types/polyglotElements/nodes/LessonTextNode';
import {
  eventHandlerFactory,
  textInputEventAdapter,
  updater,
} from '../../../utils/formHandling';
import Card from '../../Card/Card';
import { NodePropertiesProps } from '../NodeProperties';

export type LessonTextNodePropertiesProps = NodePropertiesProps & {};

const LessonTextNodeProperties = () => {
  const selectedNode = useStore((state) =>
    state.getSelectedNode()
  ) as LessonTextNode;
  const updateNode = useStore((state) => state.updateNode);

  const { id } = selectedNode.reactFlow;

  const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
  const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <StackItem>
        <Card className="flex flex-col">
          <Label>Lesson Text</Label>
          <Separator />
          <TextField
            id={`textInput-${id}`}
            multiline
            autoAdjustHeight
            value={selectedNode.data.text}
            onChange={textInputNodeUpdater(
              updater<LessonTextNode>()('data.text')
            )}
          />
        </Card>
      </StackItem>
    </Stack>
  );
};

export default LessonTextNodeProperties;
