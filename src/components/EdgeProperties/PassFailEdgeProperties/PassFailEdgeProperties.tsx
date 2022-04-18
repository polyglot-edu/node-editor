import { Dropdown, Stack, StackItem } from "@fluentui/react";
import useStore, { curriedUpdate } from "../../../store";
import { PassFailEdge, PassFailEdgeConditionKind_IoTs } from "../../../types/polyglotElements";
import { eventHandlerFactory, dropdownEventAdapter, updaterWithTypeGuard } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { EdgePropertiesProps } from "../EdgeProperties";

export type PassFailEdgePropertiesProps = EdgePropertiesProps & {};

const PassFailEdgeProperties = (props: PassFailEdgePropertiesProps) => {
    const selectedEdge = useStore(state => state.getSelectedEdge()) as PassFailEdge;
    const updateEdge = useStore(state => state.updateEdge);

    const { id } = selectedEdge;

    const genericEdgeUpdater = eventHandlerFactory(curriedUpdate(updateEdge, id));
    const dropdownEdgeUpdater = genericEdgeUpdater(dropdownEventAdapter);

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card>
                    <Dropdown
                        label="Condition"
                        id={`conditionKindInput-${id}`}
                        placeholder="Select an option"
                        options={[{ key: "pass", text: "Pass" }, { key: "fail", text: "Fail" }]}
                        onChange={dropdownEdgeUpdater(updaterWithTypeGuard<PassFailEdge>()("data.conditionKind", PassFailEdgeConditionKind_IoTs))}
                        selectedKey={selectedEdge.data.conditionKind}
                    />
                </Card>
            </StackItem>
        </Stack>
    )
}

export default PassFailEdgeProperties;