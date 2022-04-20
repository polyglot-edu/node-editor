import { Stack, StackItem, TextField } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../../store";
import { eventHandlerFactory, textInputEventAdapter, updater } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";
import { SingleChoiceNode } from "../../../types/polyglotElements/nodes/SingleChoiceNode";

export type SingleChoiceNodePropertiesProps = SingleChoiceNode & NodePropertiesProps;


const SingleChoiceNodeProperties = (props: SingleChoiceNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as SingleChoiceNode;
    const updateNode = useStore(state => state.updateNode);

    const { id } = selectedNode;
    const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
    const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card className="flex flex-col">
                    <TextField
                        label="Question"
                        id={`questionInput-${id}`}
                        multiline
                        autoAdjustHeight
                        value={selectedNode.data.question}
                        onChange={textInputNodeUpdater(updater<SingleChoiceNode>()("data.question"))}
                    />
                    <StackItem >
                        <TextField
                            label={`Answer`}
                            id={`answerInput-${id}`}
                            value={selectedNode.data.correctAnswer}
                            placeholder={`Type here answer`}
                            onChange={textInputNodeUpdater(updater<SingleChoiceNode>()("data.correctAnswer"))}
                        />
                    </StackItem>
                </Card>
            </StackItem>
        </Stack>
    );
}

export default SingleChoiceNodeProperties;