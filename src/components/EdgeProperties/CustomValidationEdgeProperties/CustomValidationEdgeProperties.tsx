import { Label, Stack, StackItem } from "@fluentui/react";
import Editor from "@monaco-editor/react";
import produce from "immer";
import useStore from "../../../store";
import { CustomValidationEdge } from "../../../types/polyglotElements";
import Card from "../../Card/Card";
import { EdgePropertiesProps } from "../EdgeProperties";

export type CustomValidationEdgePropertiesProps = EdgePropertiesProps & {};

const CustomValidationEdgeProperties = (props: CustomValidationEdgePropertiesProps) => {
    const selectedEdge = useStore(state => state.getSelectedEdge()) as CustomValidationEdge;
    const updateEdge = useStore(state => state.updateEdge);

    const { id } = selectedEdge.reactFlow;

    function onCodeChange(newValue: string | undefined) {
        const newLessonEdge = produce(selectedEdge, draft => {
            if (newValue) {
                draft.data.code = newValue;
            }
        });

        updateEdge(id, newLessonEdge);
    }

    return (
        <Stack tokens={{ childrenGap: 15 }} >
            <StackItem>
                <Card>
                    <Label>
                        Custom Validation Code
                    </Label>
                    <Editor
                        className="mt-3"
                        height={400}
                        language="csharp"
                        value={selectedEdge.data.code}
                        onChange={onCodeChange}
                        options={{
                            minimap: { enabled: false },
                            lineNumbersMinChars: 2,
                        }}
                    />
                </Card>
            </StackItem>
        </Stack>
    )
}

export default CustomValidationEdgeProperties;