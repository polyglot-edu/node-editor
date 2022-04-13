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

    function addOption(): PartialDeep<MultipleChoiceNode> {
        return produce(selectedNode, draft => {
            draft.data.options.push("");
        })
    }

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card className="flex flex-col">
                    <TextField
                        label="Question"
                        id={`questionInput-${id}`}
                        // className="pb-[20px]"
                        multiline
                        autoAdjustHeight
                        value={selectedNode.data.question}
                        onChange={textInputNodeUpdater(updater<MultipleChoiceNode>()("data.question"))}
                    />
                    <Separator />
                    {
                        selectedNode.data.options.map((option, index) => {
                            function updateOption(newValue: string): PartialDeep<MultipleChoiceNode> {
                                return produce(selectedNode, draft => {
                                    draft.data.options[index] = newValue;
                                })
                            }

                            return (
                                <StackItem key={index}>
                                    <TextField
                                        label={`Option ${index + 1}`}
                                        id={`optionInput-${id}-${index}`}
                                        value={option}
                                        placeholder={`Type here option #${index + 1}`}
                                        onChange={textInputNodeUpdater(updateOption)}
                                    />
                                </StackItem>
                            )
                        })
                    }
                    <PrimaryButton text="Add option" className="mt-4 self-center w-1/2" onClick={buttonNodeUpdater(addOption)} />
                </Card>
            </StackItem>
        </Stack>
    );
}

export default MultipleChoiceNodeProperties;