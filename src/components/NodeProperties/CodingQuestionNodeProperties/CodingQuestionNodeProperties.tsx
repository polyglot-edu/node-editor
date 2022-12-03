import { Label, Stack, StackItem, TextField } from '@fluentui/react';
import Editor from '@monaco-editor/react';
import useStore, { curriedUpdate } from '../../../store';
import { CodingQuestionNode } from '../../../types/polyglotElements';
import {
  eventHandlerFactory,
  monacoEventAdapter,
  textInputEventAdapter,
  updater,
} from '../../../utils/formHandling';
import Card from '../../Card/Card';
import { NodePropertiesProps } from '../NodeProperties';

export type CodingQuestionNodePropertiesProps = NodePropertiesProps & {};

const CodingQuestionNodeProperties = () => {
  const selectedNode = useStore((state) =>
    state.getSelectedNode()
  ) as CodingQuestionNode;
  const updateNode = useStore((state) => state.updateNode);

  const { id } = selectedNode.reactFlow;

  const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
  const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);
  const monacoNodeUpdater = genericNodeUpdater(monacoEventAdapter);

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <StackItem>
        <Card>
          <TextField
            label="Question"
            id={`questionInput-${id}`}
            multiline
            autoAdjustHeight
            value={selectedNode.data.question}
            onChange={textInputNodeUpdater(
              updater<CodingQuestionNode>()('data.question')
            )}
          />
        </Card>
      </StackItem>
      <StackItem>
        <Card className="h-[200px]">
          <Label id={`codeTemplateInput-${id}`}>Code Template</Label>
          <Editor
            height={`calc(100% - 30px)`}
            language={selectedNode.data.language}
            value={selectedNode.data.codeTemplate}
            onChange={(str, e) =>
              monacoNodeUpdater(
                updater<CodingQuestionNode>()('data.codeTemplate')
              )(e, str ?? '')
            }
          />
        </Card>
      </StackItem>
    </Stack>
  );
};

export default CodingQuestionNodeProperties;
