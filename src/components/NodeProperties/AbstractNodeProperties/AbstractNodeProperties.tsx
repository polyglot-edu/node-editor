import { Stack, StackItem, TextField, PrimaryButton} from "@fluentui/react";
import useStore from "../../../store";
//import { eventHandlerFactory, textInputEventAdapter, updater } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";
import { AbstractNode } from "../../../types/polyglotElements/nodes/AbstractNode";
import { createNewDefaultPolyglotNode } from "../../../utils/utils";


export type AbstractNodePropertiesProps = AbstractNode & NodePropertiesProps;


const AbstractNodeProperties = (props: AbstractNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as AbstractNode;
    //const updateNode = useStore(state => state.updateNode);

    /*const { id } = selectedNode.reactFlow;
    const genericNodeUpdater = eventHandlerFactory(curriedUpdate(updateNode, id));
    const textInputNodeUpdater = genericNodeUpdater(textInputEventAdapter);*/

    function generateSubtree () {
        const nodeToAdd = createNewDefaultPolyglotNode({x:50,y:50});
        useStore.getState().addNode(nodeToAdd);
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