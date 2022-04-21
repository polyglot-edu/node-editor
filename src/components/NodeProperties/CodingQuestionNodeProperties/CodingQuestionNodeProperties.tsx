import { Label, Stack, StackItem, TextField } from "@fluentui/react";
import Editor from "@monaco-editor/react";
import useStore from "../../../store";
import { CodingQuestionNode } from "../../../types/polyglotElements";
import { TextInputEvent } from "../../../utils/formHandling";
import Card from "../../Card/Card";
import { NodePropertiesProps } from "../NodeProperties";

export type CodingQuestionNodePropertiesProps = NodePropertiesProps & {};

const CodingQuestionNodeProperties = (props: CodingQuestionNodePropertiesProps) => {
    const selectedNode = useStore(state => state.getSelectedNode()) as CodingQuestionNode;
    const updateNode = useStore(state => state.updateNode);

    const { id } = selectedNode.reactFlow;

    return (
        <Stack tokens={{ childrenGap: 15 }}>
            <StackItem>
                <Card>
                    <TextField label="Option1" id={`option1Input-${id}`} value={selectedNode.title} onChange={() => { throw new Error("not implemented") }} />
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
                    <TextField label="Option1" id={`option1Input-${id}`} value={selectedNode.title} onChange={() => { throw new Error("not implemented") }} />
                </Card>
            </StackItem>
        </Stack>
    );
}

export default CodingQuestionNodeProperties;