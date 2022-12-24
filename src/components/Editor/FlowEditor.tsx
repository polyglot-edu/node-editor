import { Flex, useDisclosure } from '@chakra-ui/react';
import { MouseEventHandler, useState } from 'react';
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  EdgeMouseHandler,
  NodeMouseHandler,
  OnEdgesChange,
  OnMoveStart,
  OnNodesChange,
  OnNodesDelete,
  OnSelectionChangeParams,
  ReactFlowProvider,
  useOnSelectionChange,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '../../store';
import {
  polyglotEdgeComponentMapping,
  polyglotNodeComponentMapping,
} from '../../types/polyglotElements';
import ContextMenu, {
  ContextMenuProps,
  ContextMenuTypes,
} from '../ContextMenu/ContextMenu';
import EditorNav from '../NavBars/EditorNav';
import ElementProperties from '../Panels/ElementProperties';

type FlowEditorProps = {
  mode: 'read' | 'write';
  saveFlow: () => Promise<void>;
  onSelectionChange?: (selection: OnSelectionChangeParams) => void;
};

const deleteKeyCodes = ['Backspace', 'Delete'];

const FlowEditor = ({ saveFlow, onSelectionChange }: FlowEditorProps) => {
  const {
    getNodes,
    getEdges,
    setNodes,
    setEdges,
    removeNode,
    removeEdge,
    setSelectedElement,
    getSelectedElement,
    clearSelection,
  } = useStore((store) => ({
    getNodes: store.reactFlowNodes,
    getEdges: store.reactFlowEdges,
    setNodes: store.applyNodeChanges,
    setEdges: store.applyEdgeChanges,
    removeNode: store.removeNode,
    removeEdge: store.removeEdge,
    getSelectedElement: store.getSelectedElement,
    setSelectedElement: store.setSelectedElement,
    clearSelection: store.clearSelection,
    setLastSavedAction: store.setLastSavedAction,
  }));
  const { resetSelectedElements } = useStoreApi().getState();
  const { project } = useReactFlow();

  // SETUP context menu
  const selectedElement = getSelectedElement();

  // I need this function because hooks can only be called in components
  const compoundClearSelection = () => {
    resetSelectedElements();
    clearSelection();
  };

  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    show: false,
    type: ContextMenuTypes.DEFAULT,
    pos: { x: 0, y: 0 },
  });

  const hideContextMenu = () => {
    setContextMenu((prev) => {
      prev.show = false;
      return prev;
    });
  };

  // SETUP element propeties panel
  const {
    isOpen: isOpenPanel,
    onOpen: onOpenPanel,
    onClose: onClosePanel,
  } = useDisclosure();

  // SETUP react flow
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
    hideContextMenu();
    compoundClearSelection();
  };

  const onClick: MouseEventHandler | undefined = (e) => {
    e.preventDefault();
    hideContextMenu();
  };

  const onNodeContextMenu: NodeMouseHandler = (e, node) => {
    e.preventDefault();
    setSelectedElement({
      type: 'Node',
      id: node.id,
    });
    setContextMenu({
      type: ContextMenuTypes.NODE,
      show: true,
      pos: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  const onEdgeContextMenu: EdgeMouseHandler = (e, edge) => {
    e.preventDefault();
    setSelectedElement({
      type: 'Edge',
      id: edge.id,
    });
    setContextMenu({
      type: ContextMenuTypes.EDGE,
      show: true,
      pos: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  // Need to use the hook with the reactflow's update 11
  useOnSelectionChange({
    onChange: onSelectionChange || default_onSelectionChange,
  });

  function default_onSelectionChange({
    nodes,
    edges,
  }: OnSelectionChangeParams) {
    if (nodes.length !== 0) {
      console.log('Selected node: ', nodes[0].id);
      setSelectedElement({
        type: 'Node',
        id: nodes[0].id,
      });
    } else if (edges.length !== 0) {
      console.log('Selected edge: ', edges[0].id);
      setSelectedElement({
        type: 'Edge',
        id: edges[0].id,
      });
    } else {
      onClosePanel();
      console.log('Selection empty');
      compoundClearSelection();
    }
  }

  return (
    <Flex direction={'column'} h="100vh">
      <EditorNav saveFunc={saveFlow} />
      <Flex h={'full'} overflow="hidden">
        <ReactFlow
          // nodes setup
          nodes={getNodes()}
          nodeTypes={polyglotNodeComponentMapping.componentMapping}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDoubleClick={onOpenPanel}
          onNodeDrag={onClosePanel}
          onNodeDragStart={(_, node) => {
            useStore.getState().addAction({
              type: 'update',
              element: {
                type: 'node',
                id: node.id,
              },
              value: { reactFlow: node },
            });
          }}
          onNodeDragStop={(_, node) => {
            const action = useStore.getState().popAction();
            if (
              !action ||
              !action.value.reactFlow?.position ||
              JSON.stringify(action.value.reactFlow.position) ===
                JSON.stringify(node.position)
            ) {
              console.log('no changes!');
              return;
            }
            useStore.getState().addAction({
              type: 'update',
              element: {
                type: 'node',
                id: node.id,
              },
              value: { prev: action.value, update: { reactFlow: node } },
            });
          }}
          // edges setup
          edges={getEdges()}
          edgeTypes={polyglotEdgeComponentMapping.componentMapping}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={(edges) => edges.forEach((e) => removeEdge(e.id))}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeDoubleClick={onOpenPanel}
          // general setup node and edges
          deleteKeyCode={deleteKeyCodes}
          // selection setup
          multiSelectionKeyCode={null}
          // view setup
          snapToGrid={true}
          fitView={true}
          fitViewOptions={{ padding: 0.2 }}
          // context menu event handlers
          onClick={onClick}
          onMoveStart={onMoveStart}
          onPaneContextMenu={(e) => {
            e.preventDefault();

            const rect = e.currentTarget.getBoundingClientRect();
            setContextMenu({
              type: ContextMenuTypes.DEFAULT,
              show: true,
              pos: {
                x: e.clientX,
                y: e.clientY,
              },
              relativePos: project({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              }),
            });
          }}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
        <ContextMenu
          {...contextMenu}
          elementId={selectedElement?._id}
          onDismiss={hideContextMenu}
        />
        <ElementProperties
          selectedElement={selectedElement}
          isOpen={isOpenPanel}
        />
      </Flex>
    </Flex>
  );
};

function FlowWithProvider(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowEditor {...props} />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
