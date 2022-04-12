import { Dropdown, IDropdownOption, ITag, Label, Rating, Stack, StackItem, TagPicker, TextField } from "@fluentui/react";
import useStore from "../../store";
import { PolyglotNode, polyglotNodeComponentMapping } from "../../types/polyglotElements";
import { dropdownHandler, eventHandlerFactory, ratingHandler, simpleStringUpdater, textInputHandler } from "../../utils/formHandling";
import { curry } from "../../utils/utils";
import Card from "../Card/Card";
import "./NodeProperties.css";

export type NodePropertiesProps = {};

const typeDropdownOptions: IDropdownOption[] = Object.entries(polyglotNodeComponentMapping.nameMapping).map(([key, name]) => ({ key: key, text: name }));

const Properties = (props: NodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as PolyglotNode;
    const updateNode = useStore(state => state.updateNode);

    if (!selectedNode) {
        return <></>;
    }

    const { id } = selectedNode;

    const genericNodeUpdater = eventHandlerFactory(curry(updateNode)(selectedNode?.id));
    const textInputNodeUpdater = genericNodeUpdater(textInputHandler);

    const titleChangeHandler = textInputNodeUpdater(newTitle => ({ title: newTitle, data: { label: newTitle } }));
    const descriptionChangeHandler = textInputNodeUpdater(simpleStringUpdater("description"));
    // TODO: handle type change properly
    const typeChangeHandler = genericNodeUpdater(dropdownHandler)(simpleStringUpdater("type"));
    const ratingChangeHandler = genericNodeUpdater(ratingHandler)(simpleStringUpdater("difficulty"));

    const allowed = "Software Engineering,CSharp,Statistics,UniPi,MODELS 2021,Software Development";

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card>
                    <TextField label="Title" id={`titleInput-${id}`} value={selectedNode.title} onChange={titleChangeHandler} />
                    <TextField label="Description" id={`descriptionInput-${id}`} multiline autoAdjustHeight value={selectedNode.description} onChange={descriptionChangeHandler} />
                    <Dropdown
                        label="Type"
                        id={`typeInput-${id}`}
                        placeholder="Select an option"
                        options={typeDropdownOptions}
                        onChange={typeChangeHandler}
                        selectedKey={selectedNode.type}
                    />
                    <Label htmlFor={`ratingInput-${id}`} className="pt-[10px] pb-0" >
                        Difficulty
                    </Label>
                    <Rating
                        onChange={ratingChangeHandler}
                        id={`ratingInput-${id}`}
                        rating={selectedNode.difficulty}
                        icon="CircleFill"
                        unselectedIcon="CircleRing"
                    />
                    <Label htmlFor={`tagsInput-${id}`} >
                        Tags
                    </Label>
                    <TagPicker
                        inputProps={{
                            id: `tagsInput-${id}`,
                        }}
                        onResolveSuggestions={(filterText: string) => {
                            return filterText ? allowed.split(",").filter(tag => tag.startsWith(filterText)).map(tag => ({ key: tag, name: tag })) : [];
                        }}
                    />
                </Card>
            </StackItem>
            <StackItem>
                <Card>

                </Card>
            </StackItem>
        </Stack>
    )
};

export default Properties;