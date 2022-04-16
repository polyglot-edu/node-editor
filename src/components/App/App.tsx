import { OnSelectionChangeParams } from 'react-flow-renderer';
import useStore from '../../store';
import { polyglotNodeComponentMapping, polyglotEdgeComponentMapping } from '../../types/polyglotElements';
import DrawingArea from '../DrawingArea/DrawingArea';
import PropertiesBar from '../PropertiesBar/PropertiesBar';
import './App.css';

const App = () => {
    const selectedElement = useElementSelection();

    return (
        <div className="App">
            <header className="App-header">
                <DrawingArea onSelectionChange={selectedElement.onChange} />
                <PropertiesBar>
                    <selectedElement.NodePropertiesComponent />
                    <selectedElement.EdgePropertiesComponent />
                </PropertiesBar>
            </header>
        </div>
    );
}

const useElementSelection = () => {
    // this hook is updated every time something in the entire store changes.
    // if this needs to change, keep in mind that updates needs to be triggered when:
    // - the selection changes
    // - the kind of the selected item changes
    // - everything else that would change the kind of propertiesComponent to display.

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
        selectedNodeKind = nodeMap[selectedNode].kind;
    }
    if (selectedEdge) {
        selectedEdgeKind = edgeMap[selectedEdge].kind;
    }

    return {
        NodePropertiesComponent: polyglotNodeComponentMapping.getElementPropertiesComponent(selectedNodeKind),
        EdgePropertiesComponent: polyglotEdgeComponentMapping.getElementPropertiesComponent(selectedEdgeKind),
        onChange: handleChange
    };
}


export default App;
