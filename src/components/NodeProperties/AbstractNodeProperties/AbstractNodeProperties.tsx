import { Stack, StackItem, TextField, PrimaryButton} from "@fluentui/react";
import useStore from "../../../store";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";
import { AbstractNode } from "../../../types/polyglotElements/nodes/AbstractNode";
import subFlow from "../../../data/abstractExample";


export type AbstractNodePropertiesProps = AbstractNode & NodePropertiesProps;


const AbstractNodeProperties = (props: AbstractNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as AbstractNode;

    function generateSubtree () {
        
        useStore.getState().addSubFlow(subFlow));
    }

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card className="flex flex-col">
                    <TextField
                        label="Select Goal"
                        //id={`questionInput-${id}`}
                        multiline
                        autoAdjustHeight
                        value={selectedNode.data.question}
                        /*onChange={textInputNodeUpdater(updater<AbstractNode>()("data.question"))}*/
                    />
                    <PrimaryButton text ='Generate Sub-Tree' className="mt-4 self-center w-1/2 p-0" onClick={generateSubtree}/>
                </Card>
            </StackItem>
        </Stack>
    );
}

export default AbstractNodeProperties;