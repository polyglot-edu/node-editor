import { Flex, useDisclosure, useToast } from '@chakra-ui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { MouseEventHandler, useMemo, useState } from 'react';
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
} from 'reactflow';
import { APIV2 } from '../../data/api';
import useStore from '../../store';
import {
  polyglotEdgeComponentMapping,
  polyglotNodeComponentMapping,
} from '../../types/polyglotElements';
import ContextMenu from '../ContextMenu/ContextMenu';
import EditorNav from '../NavBars/EditorNav';
import ElementProperties from '../Panels/ElementProperties';

type FlowEditorProps = {
  mode: 'read' | 'write';
  onSelectionChange?: (selection: OnSelectionChangeParams) => void;
};

const deleteKeyCodes = ['Backspace', 'Delete'];

const FlowEditor = ({ onSelectionChange }: FlowEditorProps) => {
  const toast = useToast();
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
  }));

  // SETUP context menu
  const selectedElement = getSelectedElement();

  const [menuType, setMenuType] = useState('default');

  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [
    showingContextMenu,
    { setTrue: showContextMenu, setFalse: hideContextMenu },
  ] = useBoolean(false);

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
    hideContextMenu;
    clearSelection();
  };

  const onClick: MouseEventHandler | undefined = (e) => {
    e.preventDefault();
    hideContextMenu;
  };

  const onNodeContextMenu: NodeMouseHandler = (e, node) => {
    e.preventDefault();
    setMenuType('node');
    setSelectedElement({
      type: 'Node',
      id: node.id,
    });
    showContextMenu();
    setContextMenuPos({
      x: e.clientX - (e.clientX % 15),
      y: e.clientY - (e.clientY % 15),
    });
  };

  const onEdgeContextMenu: EdgeMouseHandler = (e, edge) => {
    e.preventDefault();
    setMenuType('edge');
    setSelectedElement({
      type: 'Edge',
      id: edge.id,
    });
    showContextMenu();
    setContextMenuPos({
      x: e.clientX - (e.clientX % 15),
      y: e.clientY - (e.clientY % 15),
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
      clearSelection();
    }
  }

  const API = useMemo(() => new APIV2(), []);
  const saveFlow = async () => {
    try {
      const flow = useStore.getState().getFlow();
      if (!flow) {
        toast({
          title: 'No flow found',
          description: 'Try do some new changes',
          status: 'warning',
          duration: 3000,
          position: 'bottom-left',
          isClosable: true,
        });
        return;
      }

      const response = await API.saveFlowAsync(flow);
      if (response?.status === 200) {
        toast({
          title: 'Flow saved',
          description: 'The save was successful',
          status: 'success',
          duration: 3000,
          position: 'bottom-left',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Flow not saved',
          description: 'Something is off with your flow!',
          status: 'warning',
          duration: 3000,
          position: 'bottom-left',
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Internal Error',
        description: 'Try later',
        status: 'error',
        duration: 3000,
        position: 'bottom-left',
        isClosable: true,
      });
    }
  };

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

function FlowWithProvider({ mode, onSelectionChange }: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowEditor mode={mode} onSelectionChange={onSelectionChange} />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
