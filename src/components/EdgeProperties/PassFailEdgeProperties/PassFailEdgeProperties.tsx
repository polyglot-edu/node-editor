import { Stack, StackItem } from "@fluentui/react";
import useStore from "../../../store";
import Card from "../../Card/Card";
import { EdgePropertiesProps } from "../EdgeProperties";

export type PassFailEdgePropertiesProps = EdgePropertiesProps & {};

const PassFailEdgeProperties = (props: PassFailEdgePropertiesProps) => {
    const selectedEdge = useStore(state => state.getSelectedEdge());

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card>
                    uuu
                </Card>
            </StackItem>
        </Stack>
    )
}

export default PassFailEdgeProperties;