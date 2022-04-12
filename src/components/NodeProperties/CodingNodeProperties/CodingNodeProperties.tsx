import { Label, Stack, StackItem, TextField } from "@fluentui/react";
import Editor from "@monaco-editor/react";
import useStore from "../../../store";
import { CodingNode } from "../../../types/polyglotElements";
import { TextInputEvent } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";

export type CodingNodePropertiesProps = NodePropertiesProps & {};

const CodingNodeProperties = (props: CodingNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as CodingNode;
    const { id } = selectedNode;

    const updateNode = useStore(state => state.updateNode);

    const handleTitleChange = (e: TextInputEvent) => {
        const newTitle = e.currentTarget.value;
        console.log("Updating node with id: ", id, " title to: ", newTitle, " prev title was: ", selectedNode.title, " with label: ", selectedNode.data.label);
        updateNode(id, { title: newTitle, data: { label: newTitle } });
    }

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card>
                    <TextField label="Option1" id={`option1Input-${id}`} value={selectedNode.title} onChange={handleTitleChange} />
                </Card>
            </StackItem>
            <StackItem>
                <Card className="h-[200px]">
                    <Label id={`solutionInput-${id}`}>
                        Solution
                    </Label>
                    <Editor
                        height={`calc(100% - 30px)`}
                        language="csharp"
                        defaultValue={`using System;

int main() {
    Console.WriteLine("Hello World!");
    return 0;
}
`}
                    />
                </Card>
            </StackItem>
            <StackItem>
                <Card>
                    <TextField label="Option1" id={`option1Input-${id}`} value={selectedNode.title} onChange={handleTitleChange} />
                </Card>
            </StackItem>
        </Stack>
    );
}

export default CodingNodeProperties;