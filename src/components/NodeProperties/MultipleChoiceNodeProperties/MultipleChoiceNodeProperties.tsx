import { DefaultButton, Label, PrimaryButton, Separator, Stack, StackItem, TextField } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../../store";
import { MultipleChoiceNode } from "../../../types/polyglotElements";
import { buttonEventAdapter, eventHandlerFactory, textInputEventAdapter, updater } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";
import type { PartialDeep } from "type-fest";
import produce from "immer";

export type MultipleChoiceNodePropertiesProps = MultipleChoiceNode & NodePropertiesProps;


const MultipleChoiceNodeProperties = (props: MultipleChoiceNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as MultipleChoiceNode;
    const updateNode = useStore(state => state.updateNode);
    const { id } = selectedNode;


    const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
    const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);
    const buttonNodeUpdater = genericNodeUpdater(buttonEventAdapter);

    function addChoice(): PartialDeep<MultipleChoiceNode> {
        return produce(selectedNode, draft => {
            draft.data.choices.push("");
        })
    }

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
                        onChange={textInputNodeUpdater(updater<MultipleChoiceNode>()("data.question"))}
                    />
                    <Separator />
                    {
                        selectedNode.data.choices.map((choice, index) => {
                            function updateChoice(newValue: string): PartialDeep<MultipleChoiceNode> {
                                return produce(selectedNode, draft => {
                                    draft.data.choices[index] = newValue;
                                })
                            }

                            return (
                                <StackItem key={index}>
                                    <TextField
                                        label={`Choice ${index + 1}`}
                                        id={`choiceInput-${id}-${index}`}
                                        value={choice}
                                        placeholder={`Type here choice #${index + 1}`}
                                        onChange={textInputNodeUpdater(updateChoice)}
                                    />
                                </StackItem>
                            )
                        })
                    }
                    <PrimaryButton text="Add choice" className="mt-4 self-center w-1/2" onClick={buttonNodeUpdater(addChoice)} />
                </Card>
            </StackItem>
        </Stack>
    );
}

export default MultipleChoiceNodeProperties;