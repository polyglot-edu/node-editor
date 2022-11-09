import { useBoolean } from '@fluentui/react-hooks';
import { MouseEventHandler, useState } from 'react';
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  OnSelectionChangeParams,
  Node,
  NodeMouseHandler,
  OnNodesChange,
  OnEdgesChange,
  OnNodesDelete,
  OnMoveStart,
} from 'react-flow-renderer';
import useStore from '../../store';
import {
  polyglotEdgeComponentMapping,
  polyglotNodeComponentMapping,
} from '../../types/polyglotElements';
import ContextMenu from '../ContextMenu/ContextMenu';

type DrawingAreaProps = {
  onSelectionChange: (selection: OnSelectionChangeParams) => void;
};

const deleteKeyCodes = ['Backspace', 'Delete'];

const Flow = ({ onSelectionChange }: DrawingAreaProps) => {
  const { getNodes, getEdges, setNodes, setEdges, removeNode, removeEdge } =
    useStore((store) => ({
      getNodes: store.reactFlowNodes,
      getEdges: store.reactFlowEdges,
      setNodes: store.applyNodeChanges,
      setEdges: store.applyEdgeChanges,
      removeNode: store.removeNode,
      removeEdge: store.removeEdge,
    }));

  // const nodes = getNodes();
  // const edges = getEdges();

  const [clickedNode, setClickedNode] = useState<Node | undefined>(undefined);
  const [menuType, setMenuType] = useState('default');

  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [
    showingContextMenu,
    { setTrue: showContextMenu, setFalse: hideContextMenu },
  ] = useBoolean(false);

  const onNodesChange: OnNodesChange = (changes) => {
    setNodes(applyNodeChanges(changes, getNodes()));
  };
  const onEdgesChange: OnEdgesChange = (changes) => {
    setEdges(applyEdgeChanges(changes, getEdges()));
  };

  const onNodesDelete: OnNodesDelete = (nodes) => {
    nodes.forEach((n) => removeNode(n.id));
    setNodes(getNodes());
  };

  const onMoveStart: OnMoveStart = () => {
    hideContextMenu;
    setClickedNode(undefined);
  };

  const onClick: MouseEventHandler | undefined = (e) => {
    e.preventDefault();
    hideContextMenu;
    setClickedNode(undefined);
  };

  const onNodeContextMenu: NodeMouseHandler = (e, node) => {
    e.preventDefault();
    setMenuType('node');
    setClickedNode(node);
    showContextMenu();
    setContextMenuPos({
      x: e.clientX - (e.clientX % 15),
      y: e.clientY - (e.clientY % 15),
    });
  };

  return (
    <>
      <ReactFlow
        // nodes setup
        nodes={getNodes()}
        nodeTypes={polyglotNodeComponentMapping.componentMapping}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onNodeContextMenu={onNodeContextMenu}
        // edges setup
        edges={getEdges()}
        edgeTypes={polyglotEdgeComponentMapping.componentMapping}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={(edges) => edges.forEach((e) => removeEdge(e.id))}
        multiSelectionKeyCode={null}
        deleteKeyCode={deleteKeyCodes}
        onSelectionChange={onSelectionChange}
        // view setup
        snapToGrid={true}
        fitView={true}
        fitViewOptions={{ padding: 0.2 }}
        // context menu event handlers
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onClick={onClick}
        onMoveStart={onMoveStart}
        onPaneContextMenu={(e) => {
          e.preventDefault();
          setMenuType('default');
          showContextMenu();
          setContextMenuPos({
            x: e.clientX - (e.clientX % 15),
            y: e.clientY - (e.clientY % 15),
          });
        }}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
      <ContextMenu
        pos={contextMenuPos}
        showing={showingContextMenu}
        type={menuType}
        node={clickedNode}
        onDismiss={hideContextMenu}
      />
    </>
  );
};

const DrawingArea = (props: DrawingAreaProps) => {
  return (
    <div className="flex flex-col flex-1 h-screen w-full ease-in-out duration-300">
      <Flow {...props} />
    </div>
  );
};

export default DrawingArea;
