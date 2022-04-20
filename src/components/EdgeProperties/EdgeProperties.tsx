import { Dropdown, IDropdownOption, Stack, StackItem, TextField } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../store";
import { PolyglotEdge, polyglotEdgeComponentMapping } from "../../types/polyglotElements";
import { dropdownEventAdapter, eventHandlerFactory, textInputEventAdapter, updater } from "../../utils/formHandling";
import Card from "../Card/Card";

export type EdgePropertiesProps = {};

const typeDropdownOptions: IDropdownOption[] = Object.entries(polyglotEdgeComponentMapping.nameMapping).map(([key, name]) => ({ key: key, text: name }));

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

    // TODO: handle type change properly
    const typeChangeHandler = dropdownEdgeUpdater(updater<PolyglotEdge>()("type"));

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
                        id={`typeInput-${id}`}
                        placeholder="Select an option"
                        options={typeDropdownOptions}
                        onChange={typeChangeHandler}
                        selectedKey={selectedEdge.type}
                    />
                </Card>
            </StackItem>
        </Stack>
    )
};

export default Properties;