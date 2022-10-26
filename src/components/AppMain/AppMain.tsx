import Editor from '@monaco-editor/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { OnSelectionChangeParams } from 'react-flow-renderer';
import toast from 'react-hot-toast';
import { API } from '../../data/api';
import useStore from '../../store';
import { polyglotNodeComponentMapping, polyglotEdgeComponentMapping } from '../../types/polyglotElements';
import DrawingArea from '../DrawingArea/DrawingArea';
import PropertiesBar from '../PropertiesBar/PropertiesBar';

type AppMainProps = {
    canSaveFlow?: boolean;
}

const AppMain = ({ canSaveFlow }: AppMainProps) => {
    const selectedElement = useElementSelection();
    const router = useRouter();

    useEffect(() => {
        async function onKeyDown(e: KeyboardEvent) {
            if (e.key.toLowerCase() === "n" && e.altKey) {
                try {
                    const newFlowPromise = API.createNewFlowAsync();
                    toast.promise(newFlowPromise, {
                        loading: "Creating new flow...",
                        success: (response) => response.status === 200 ? "New flow created!" : "Failed to create new flow!",
                        error: "Failed to create new flow!"
                    });

                    const response = await newFlowPromise;
                    if (response.status !== 200) {
                        console.log("Error creating new flow", response.statusText);
                        return;
                    }
                    router.replace(`/id/${response.data.id}`);
                } catch (error) {
                    console.log(error);
                }
            } else if (e.key.toLowerCase() === "s" && e.altKey) {
                if (!canSaveFlow) {
                    toast.error("Cannot override this flow");
                    return;
                }

                try {
                    const flow = useStore.getState().getFlow();
                    if (!flow) {
                        toast.error("No flow loaded");
                        return;
                    }

                    const saveFlowPromise = API.saveFlowAsync(flow);
                    toast.promise(saveFlowPromise, {
                        loading: "Saving flow...",
                        success: (response) => response.status === 200 ? "Flow saved successfully" : "Error saving flow",
                        error: "Error saving flow"
                    });

                    const response = await saveFlowPromise;
                    if (response.status !== 200) {
                        console.log("Error saving flow", response.statusText);
                        return;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [canSaveFlow, router])




    return (
        <div>
            <header className="App-header">
                <div className='flex'>
                    <DrawingArea onSelectionChange={selectedElement.onChange} />
                    <PropertiesBar>
                        <selectedElement.NodePropertiesComponent />
                        <selectedElement.EdgePropertiesComponent />
                    </PropertiesBar>
                </div>
            </header>
        </div>
    );
}

const useElementSelection = () => {
    // this hook is updated every time something in the entire store changes.
    // if this needs to change, keep in mind that updates needs to be triggered when:
    // - the selection changes
    // - the type of the selected item changes
    // - everything else that would change the type of propertiesComponent to display.

    const {
        nodeMap,
        edgeMap,
        selectedNode,
        selectedEdge,
        setSelectedNode,
        setSelectedEdge,
        clearSelection
    } = useStore();

    let selectedNodeKind = undefined;
    let selectedEdgeKind = undefined;

    function handleChange({ nodes, edges }: OnSelectionChangeParams) {
        if (nodes.length !== 0) {
            console.log("Selected node: ", nodes[0].id);
            setSelectedNode(nodes[0].id);
        } else if (edges.length !== 0) {
            console.log("Selected edge: ", edges[0].id);
            setSelectedEdge(edges[0].id);
        } else {
            console.log("Selection empty");
            clearSelection()
        }
    }

    if (selectedNode) {
        selectedNodeKind = nodeMap.get(selectedNode)?.type;
    }
    if (selectedEdge) {
        selectedEdgeKind = edgeMap.get(selectedEdge)?.type;
    }

    return {
        NodePropertiesComponent: polyglotNodeComponentMapping.getElementPropertiesComponent(selectedNodeKind),
        EdgePropertiesComponent: polyglotEdgeComponentMapping.getElementPropertiesComponent(selectedEdgeKind),
        onChange: handleChange
    };
}

export default AppMain;