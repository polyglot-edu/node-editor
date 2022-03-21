import { StackItem, TextField } from "@fluentui/react";
import useStore from "../../../store";
import { CodingNode } from "../../../types/polyglotElements";
import { FormInputEvent } from "../../../utils/utils";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";

export type CodingNodePropertiesProps = NodePropertiesProps & {};

const CodingNodeProperties = (props: CodingNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as CodingNode;
    const { id } = selectedNode;

    const updateNode = useStore(state => state.updateNode);

    const handleTitleChange = (e: FormInputEvent) => {
        const newTitle = e.currentTarget.value;
        console.log("Updating node with id: ", id, " title to: ", newTitle, " prev title was: ", selectedNode.title, " with label: ", selectedNode.data.label);
        updateNode(id, { title: newTitle, data: { label: newTitle } });
    }
    const handleDescriptionChange = (e: FormInputEvent) => {
        const newDescription = e.currentTarget.value;
        console.log("Updating node with id: ", id, " description to: ", newDescription);
        updateNode(id, { description: newDescription });
    }

    return (
        <StackItem>
            <Card>
                <TextField label="Title" id={`titleInput-${id}`} value={selectedNode.title} onChange={handleTitleChange} />
                <TextField label="Description" id={`descriptionInput-${id}`} multiline autoAdjustHeight value={selectedNode.description} onChange={handleDescriptionChange} />
            </Card>
        </StackItem>
    );
}

export default CodingNodeProperties;