import ReactFlow, { applyEdgeChanges, applyNodeChanges, Background, BackgroundVariant, Controls, EdgeChange, NodeChange, OnSelectionChangeParams } from 'react-flow-renderer';
import useStore from '../../store';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '../../types/polyglotElements';
import "./DrawingArea.css";

type DrawingAreaProps = {
    onSelectionChange: (selection: OnSelectionChangeParams) => void;
};

const Flow = ({ onSelectionChange }: DrawingAreaProps) => {
    const [
        nodes,
        edges,
        setNodes,
        setEdges,
    ] = useStore(store => [store.nodes(), store.edges(), store.applyNodeChanges, store.applyEdgeChanges]);

    function onNodesChange(changes: NodeChange[]) {
        setNodes(applyNodeChanges(changes, nodes));
    }
    function onEdgesChange(changes: EdgeChange[]) {
        setEdges(applyEdgeChanges(changes, edges));
    }

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            multiSelectionKeyCode={null}
            onSelectionChange={onSelectionChange}
            nodeTypes={polyglotNodeComponentMapping.componentMapping}
            edgeTypes={polyglotEdgeComponentMapping.componentMapping}
            snapToGrid={true}
        >
            <Background variant={BackgroundVariant.Dots} />
            <Controls />
        </ReactFlow>
    )
}

const DrawingArea = (props: DrawingAreaProps) => {
    return (
        <div className="flex flex-col flex-1 w-[calc(100%_-_var(--properties-bar-width))] ease-in-out duration-300" onContextMenu={e => e.preventDefault()}>
            <Flow {...props} />
        </div>
    );
};

export default DrawingArea;