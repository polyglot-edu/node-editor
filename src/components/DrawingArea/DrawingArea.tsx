import { useBoolean } from '@fluentui/react-hooks';
import { useState } from 'react';
import ReactFlow, { applyEdgeChanges, applyNodeChanges, Background, BackgroundVariant, Controls, EdgeChange, NodeChange, OnSelectionChangeParams, Node, Edge } from 'react-flow-renderer';
import useStore from '../../store';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '../../types/polyglotElements';
import ContextMenu from '../ContextMenu/ContextMenu';
import "./DrawingArea.css";

type DrawingAreaProps = {
    onSelectionChange: (selection: OnSelectionChangeParams) => void;
};

const deleteKeyCodes = ['Backspace', 'Delete'];

const Flow = ({ onSelectionChange }: DrawingAreaProps) => {
    const { getNodes, getEdges, setNodes, setEdges, removeNode, removeEdge } = useStore(store => ({
        getNodes: store.reactFlowNodes,
        getEdges: store.reactFlowEdges,
        setNodes: store.applyNodeChanges,
        setEdges: store.applyEdgeChanges,
        removeNode: store.removeNode,
        removeEdge: store.removeEdge,
    }));

    // const nodes = getNodes();
    // const edges = getEdges();

    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [showingContextMenu, { setTrue: showContextMenu, setFalse: hideContextMenu }] = useBoolean(false);

    function onNodesChange(changes: NodeChange[]) {
        setNodes(applyNodeChanges(changes, getNodes()));
    }
    function onEdgesChange(changes: EdgeChange[]) {
        setEdges(applyEdgeChanges(changes, getEdges()));
    }

    function onNodesDelete(nodes: Node[]) {
        nodes.forEach(n => removeNode(n.id));
        setNodes(getNodes());
    }

    return (
        <>
            <ReactFlow
                // nodes setup
                nodes={getNodes()}
                nodeTypes={polyglotNodeComponentMapping.componentMapping}
                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}

                // edges setup
                edges={getEdges()}
                edgeTypes={polyglotEdgeComponentMapping.componentMapping}
                onEdgesChange={onEdgesChange}
                onEdgesDelete={(edges) => edges.forEach(e => removeEdge(e.id))}

                multiSelectionKeyCode={null}
                deleteKeyCode={deleteKeyCodes}
                onSelectionChange={onSelectionChange}

                // view setup
                snapToGrid={true}
                fitView={true}
                fitViewOptions={{ padding: 0.2 }}

                // context menu event handlers
                onContextMenu={e => { e.preventDefault(); }}
                onClick={hideContextMenu}
                onMoveStart={hideContextMenu}
                onPaneContextMenu={e => {
                    showContextMenu();
                    setContextMenuPos({ x: e.clientX - (e.clientX % 15), y: e.clientY - (e.clientY % 15) });
                    e.preventDefault();
                }}
            >
                <Background variant={BackgroundVariant.Dots} />
                <Controls />
            </ReactFlow>
            <ContextMenu pos={contextMenuPos} showing={showingContextMenu} onDismiss={hideContextMenu} />
        </>
    )
}

const DrawingArea = (props: DrawingAreaProps) => {
    return (
        <div className="flex flex-col flex-1 w-[calc(100%_-_var(--properties-bar-width))] ease-in-out duration-300">
            <Flow {...props} />
        </div>
    );
};

export default DrawingArea;