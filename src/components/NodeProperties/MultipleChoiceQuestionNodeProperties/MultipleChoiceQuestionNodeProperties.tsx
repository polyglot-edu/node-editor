import { Checkbox, PrimaryButton, Separator, Stack, StackItem, TextField, Text, useTheme, IconButton } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../../store";
import { MultipleChoiceQuestionNode } from "../../../types/polyglotElements";
import { buttonEventAdapter, checkboxEventAdapter, eventHandlerFactory, textInputEventAdapter, updater } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";
import type { PartialDeep } from "type-fest";
import produce from "immer";

export type MultipleChoiceQuestionNodePropertiesProps = MultipleChoiceQuestionNode & NodePropertiesProps;


const MultipleChoiceQuestionNodeProperties = (props: MultipleChoiceQuestionNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as MultipleChoiceQuestionNode;
    const updateNode = useStore(state => state.updateNode);
    const theme = useTheme();

    const { id } = selectedNode.reactFlow;

    const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
    const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);
    const checkboxNodeUpdater = genericNodeUpdater(checkboxEventAdapter);
    const buttonNodeUpdater = genericNodeUpdater(buttonEventAdapter);

    function addChoice(): PartialDeep<MultipleChoiceQuestionNode> {
        return produce(selectedNode, draft => {
            draft.data.choices.push("");
            draft.data.isChoiceCorrect.push(false);
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
                        onChange={textInputNodeUpdater(updater<MultipleChoiceQuestionNode>()("data.question"))}
                    />
                    <Separator />
                    <div className="mb-3 flex flex-row justify-between">
                        <Text
                            variant="xLarge"
                        >
                            Choices
                        </Text>
                        <Text
                            className="pr-[44px] self-end"
                            variant="xLarge"
                        >
                            Is Correct
                        </Text>
                    </div>
                    <Stack tokens={{ childrenGap: 10 }}>
                        {
                            selectedNode.data.choices.map((choice, index) => {
                                function updateChoice(newValue: string): PartialDeep<MultipleChoiceQuestionNode> {
                                    return produce(selectedNode, draft => {
                                        draft.data.choices[index] = newValue;
                                    })
                                }

                                function updateCorrectChoice(checked: boolean): PartialDeep<MultipleChoiceQuestionNode> {
                                    return produce(selectedNode, draft => {
                                        draft.data.isChoiceCorrect[index] = checked;
                                    })
                                }

                                function deleteChoice(): PartialDeep<MultipleChoiceQuestionNode> {
                                    return produce(selectedNode, draft => {
                                        draft.data.choices.splice(index, 1);
                                        draft.data.isChoiceCorrect.splice(index, 1);
                                    })
                                }

                                return (
                                    <StackItem key={index}>
                                        <div
                                            className="flex flex-row"
                                        >
                                            <TextField
                                                className="flex-1"
                                                label={`Choice ${index + 1}`}
                                                onRenderLabel={(textFieldProps) =>
                                                    <Text variant="small">
                                                        {textFieldProps?.label!}
                                                    </Text>
                                                }
                                                id={`choiceInput-${id}-${index}`}
                                                value={choice}
                                                placeholder={`Type here choice #${index + 1}`}
                                                onChange={textInputNodeUpdater(updateChoice)}
                                            />
                                            <Checkbox
                                                className="ml-4"
                                                styles={{ root: { alignSelf: "flex-end" }, checkbox: { width: 32, height: 32 } }}
                                                checked={selectedNode.data.isChoiceCorrect[index]}
                                                onChange={checkboxNodeUpdater(updateCorrectChoice)}
                                            />
                                            <IconButton
                                                className="self-end ml-2"
                                                iconProps={{ iconName: "Delete", style: { fontSize: 20, color: theme.palette.red } }}
                                                onClick={buttonNodeUpdater(deleteChoice)}
                                            />
                                        </div>
                                    </StackItem>
                                )
                            })
                        }
                    </Stack>
                    <PrimaryButton text="Add choice" className="mt-4 self-center w-1/2" onClick={buttonNodeUpdater(addChoice)} />
                </Card>
            </StackItem>
        </Stack>
    );
}

export default MultipleChoiceQuestionNodeProperties;