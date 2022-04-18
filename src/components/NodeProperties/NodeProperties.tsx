import { Dropdown, IDropdownOption, Label, Rating, Stack, StackItem, TagPicker, TextField } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../store";
import { PolyglotNode, polyglotNodeComponentMapping } from "../../types/polyglotElements";
import { dropdownEventAdapter, eventHandlerFactory, ratingEventAdapter, textInputEventAdapter, updater } from "../../utils/formHandling";
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

    const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
    const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);
    const dropdownNodeUpdater = genericNodeUpdater(dropdownEventAdapter);
    const ratingNodeUpdater = genericNodeUpdater(ratingEventAdapter);

    // TODO: handle type change properly
    const typeChangeHandler = dropdownNodeUpdater(updater<PolyglotNode>()("type"));

    const allowed = "Software Engineering,CSharp,Statistics,UniPi,MODELS 2021,Software Development";

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card>
                    <TextField
                        label="Title"
                        id={`titleInput-${id}`}
                        value={selectedNode.title}
                        onChange={textInputNodeUpdater(newTitle => ({ title: newTitle, data: { label: newTitle } }))}
                    />
                    <TextField
                        label="Description"
                        id={`descriptionInput-${id}`}
                        multiline
                        autoAdjustHeight
                        value={selectedNode.description}
                        onChange={textInputNodeUpdater(updater<PolyglotNode>()("description"))}
                    />
                    <Dropdown
                        label="Kind"
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
                        onChange={ratingNodeUpdater(updater<PolyglotNode>()("difficulty"))}
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
                    <Label htmlFor={`prerequisitesInput-${id}`} >
                        Prerequisites
                    </Label>
                    <TagPicker
                        inputProps={{
                            id: `prerequisitesInput-${id}`,
                        }}
                        onResolveSuggestions={(filterText: string) => {
                            return filterText ? allowed.split(",").filter(tag => tag.startsWith(filterText)).map(tag => ({ key: tag, name: tag })) : [];
                        }}
                    />

                    <Label htmlFor={`competencesAcquiredInput-${id}`} >
                        Competences Acquired
                    </Label>
                    <TagPicker
                        inputProps={{
                            id: `competencesAcquiredInput-${id}`,
                        }}
                        onResolveSuggestions={(filterText: string) => {
                            return filterText ? allowed.split(",").filter(tag => tag.startsWith(filterText)).map(tag => ({ key: tag, name: tag })) : [];
                        }}
                    />
                </Card>
            </StackItem>
        </Stack>
    )
};

export default Properties;