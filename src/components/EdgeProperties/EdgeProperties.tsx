import { Dropdown, IDropdownOption, Label, Rating, Stack, StackItem, TagPicker, TextField } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../store";
import { PolyglotEdge, polyglotEdgeComponentMapping } from "../../types/polyglotElements";
import { dropdownEventAdapter, eventHandlerFactory, textInputEventAdapter, updater } from "../../utils/formHandling";
import Card from "../Card/Card";
import "./EdgeProperties.css";

export type EdgePropertiesProps = {};

const kindDropdownOptions: IDropdownOption[] = Object.entries(polyglotEdgeComponentMapping.nameMapping).map(([key, name]) => ({ key: key, text: name }));

const Properties = (props: EdgePropertiesProps) => {
    const selectedEdge = useStore(state => state.getSelectedEdge()) as PolyglotEdge;
    const updateEdge = useStore(state => state.updateEdge);

    if (!selectedEdge) {
        return <></>;
    }

    const { id } = selectedEdge;

    const genericEdgeUpdater = eventHandlerFactory(curriedUpdate(updateEdge, id));
    const textInputEdgeUpdater = genericEdgeUpdater(textInputEventAdapter);
    const dropdownEdgeUpdater = genericEdgeUpdater(dropdownEventAdapter);

    // TODO: handle kind change properly
    const kindChangeHandler = dropdownEdgeUpdater(updater<PolyglotEdge>()("kind"));

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card>
                    <TextField
                        label="Title"
                        id={`titleInput-${id}`}
                        value={selectedEdge.title}
                        onChange={textInputEdgeUpdater(updater<PolyglotEdge>()("title"))}
                    />
                    <Dropdown
                        label="Kind"
                        id={`kindInput-${id}`}
                        placeholder="Select an option"
                        options={kindDropdownOptions}
                        onChange={kindChangeHandler}
                        selectedKey={selectedEdge.kind}
                    />
                </Card>
            </StackItem>
        </Stack>
    )
};

export default Properties;