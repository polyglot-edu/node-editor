import { DefaultButton, NeutralColors, Text } from "@fluentui/react";
import Editor from "@monaco-editor/react";
import useStore from "../../store";
import { useToggleCSSVariable } from "../../utils/utils";
import PropertiesStack from "../PropertiesStack/PropertiesStack";
import "./PropertiesBar.css";

type PropertiesBarProps = {};

const PropertiesBar = ({ children }: React.PropsWithChildren<PropertiesBarProps>) => {
    const [selectedNode, selectedEdge] = useStore(state => [state.getSelectedNode(), state.getSelectedEdge()]);
    const { index, toggle: toggleSidebarWidth } = useToggleCSSVariable("--properties-bar-width", ["500px", "600px"]);
    const icons = ["Code", "SidePanelMirrored"]

    function isCodeMode() {
        return index === 1;
    }

    return (
        <div id="PropertiesBar" className="absolute right-0 h-full w-[var(--properties-bar-width)] z-10 ease-in-out duration-300 p-[10px]" style={{ backgroundColor: NeutralColors.gray10 }}>
            <div id="PropertiesBarHeader" className="p-5">
                <Text variant="xxLarge">
                    Properties
                </Text>
                <DefaultButton
                    toggle
                    checked={!!index}
                    iconProps={{ iconName: icons[index] }}
                    onClick={toggleSidebarWidth}
                    style={{ float: "right" }}
                />
            </div>
            {
                isCodeMode()
                    ? <Editor
                        height={`calc(100% - ${document.getElementById('PropertiesBarHeader')?.clientHeight}px)`}
                        language="json"
                        value={JSON.stringify(selectedNode ?? selectedEdge, null, 4) ?? ""}
                    />
                    : <PropertiesStack
                        height={`calc(100% - ${document.getElementById('PropertiesBarHeader')?.clientHeight}px)`}
                    >
                        {children}
                    </PropertiesStack>
            }
        </div>
    );
};

export default PropertiesBar;