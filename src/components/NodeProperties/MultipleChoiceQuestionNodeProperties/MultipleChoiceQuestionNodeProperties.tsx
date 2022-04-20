import { PrimaryButton, Separator, Stack, StackItem, TextField } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../../store";
import { MultipleChoiceQuestionNode } from "../../../types/polyglotElements";
import { buttonEventAdapter, eventHandlerFactory, textInputEventAdapter, updater } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";
import type { PartialDeep } from "type-fest";
import produce from "immer";

export type MultipleChoiceQuestionNodePropertiesProps = MultipleChoiceQuestionNode & NodePropertiesProps;


const MultipleChoiceQuestionNodeProperties = (props: MultipleChoiceQuestionNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as MultipleChoiceQuestionNode;
    const updateNode = useStore(state => state.updateNode);

    const { id } = selectedNode;

    const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
    const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);
    const buttonNodeUpdater = genericNodeUpdater(buttonEventAdapter);

    function addChoice(): PartialDeep<MultipleChoiceQuestionNode> {
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
                        onChange={textInputNodeUpdater(updater<MultipleChoiceQuestionNode>()("data.question"))}
                    />
                    <Separator />
                    {
                        selectedNode.data.choices.map((choice, index) => {
                            function updateChoice(newValue: string): PartialDeep<MultipleChoiceQuestionNode> {
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

export default MultipleChoiceQuestionNodeProperties;