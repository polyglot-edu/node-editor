import { Stack, StackItem, TextField } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../../store";
import { eventHandlerFactory, textInputEventAdapter, updater } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";
import { CloseEndedQuestionNode } from "../../../types/polyglotElements/nodes/CloseEndedQuestionNode";

export type CloseEndedQuestionNodePropertiesProps = CloseEndedQuestionNode & NodePropertiesProps;


const CloseEndedQuestionNodeProperties = (props: CloseEndedQuestionNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as CloseEndedQuestionNode;
    const updateNode = useStore(state => state.updateNode);

    const { id } = selectedNode.reactFlow;
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
                        onChange={textInputNodeUpdater(updater<CloseEndedQuestionNode>()("data.question"))}
                    />
                    <StackItem >
                        <TextField
                            label={`Answer`}
                            id={`answerInput-${id}`}
                            value={selectedNode.data.correctAnswer}
                            placeholder={`Type here answer`}
                            onChange={textInputNodeUpdater(updater<CloseEndedQuestionNode>()("data.correctAnswer"))}
                        />
                    </StackItem>
                </Card>
            </StackItem>
        </Stack>
    );
}

export default CloseEndedQuestionNodeProperties;