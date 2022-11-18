import { merge } from '@fluentui/react';
import produce, { enableMapSet } from 'immer';
import { Connection, Edge, Node } from 'react-flow-renderer';
import type { PartialDeep } from 'type-fest';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  PolyglotEdge,
  polyglotEdgeComponentMapping,
  PolyglotEdge_IoTs,
  PolyglotFlow,
  PolyglotFlowInfo,
  PolyglotNode,
  polyglotNodeComponentMapping,
  PolyglotNode_IoTs,
} from './types/polyglotElements';
import { createNewDefaultPolyglotEdge } from './utils/utils';

enableMapSet();

function createElementMapping<T extends PolyglotNode | PolyglotEdge>(arr: T[]) {
  const mapping = new Map<string, T>();
  arr.forEach((el) => {
    mapping.set(el.reactFlow.id, el);
  });
  return mapping;
}

export type SelectedElement = {
  type: 'Node' | 'Edge' | 'none';
  id: string;
};

interface ApplicationState {
  loadFlow: (flow: PolyglotFlow) => void;
  updateFlowInfo: (newValue: PartialDeep<PolyglotFlowInfo>) => void;
  getFlow: () => Nullable<PolyglotFlow>;
  activeFlowInfo: Nullable<PolyglotFlowInfo>;
  nodeMap: Map<string, PolyglotNode>;
  edgeMap: Map<string, PolyglotEdge>;
  reactFlowNodes: () => Node[];
  reactFlowEdges: () => Edge[];

  selectedElement: Nullable<SelectedElement>;
  selectedNode: Nullable<string>;
  selectedEdge: Nullable<string>;
  getSelectedElement: () => PolyglotEdge | PolyglotNode | undefined;
  getSelectedNode: () => Nullable<PolyglotNode>;
  getSelectedEdge: () => Nullable<PolyglotEdge>;
  setSelectedElement: (element: SelectedElement) => void;
  setSelectedNode: (nodeId: string) => void;
  setSelectedEdge: (edgeId: string) => void;
  clearSelection: () => void;

  applyNodeChanges: (changes: Node[]) => void;
  applyEdgeChanges: (changes: Edge[]) => void;

  addSubFlow: (flow: PolyglotFlow) => void;
  addNode: (initialValue: PolyglotNode) => void;
  updateNode: (id: string, newValue: PartialDeep<PolyglotNode>) => void;
  removeNode: (id: string) => void;

  addEdge: (initialValue: PolyglotEdge) => void;
  updateEdge: (id: string, newValue: PartialDeep<PolyglotEdge>) => void;
  removeEdge: (id: string) => void;

  onConnect: (connection: Connection) => void;
}

const useStore = create<ApplicationState>(
  devtools((set, get) => ({
    loadFlow: (flow) => {
      set((state) =>
        produce(state, (draft) => {
          draft.activeFlowInfo = flow;
          if (flow.nodes) draft.nodeMap = createElementMapping(flow.nodes);
          if (flow.edges) draft.edgeMap = createElementMapping(flow.edges);
          draft.clearSelection();
        })
      );
    },
    updateFlowInfo: (newValue: PartialDeep<PolyglotFlowInfo>) => {
      set((state) =>
        produce(state, (draft) => {
          draft.activeFlowInfo = merge<PolyglotFlowInfo>(
            draft.activeFlowInfo!,
            newValue
          );
        })
      );
    },
    getFlow: () => {
      const state = get();
      if (!state.activeFlowInfo) {
        return null;
      }

      return {
        ...state.activeFlowInfo,
        nodes: Array.from(state.nodeMap.values()),
        edges: Array.from(state.edgeMap.values()),
      };
    },
    activeFlowInfo: null,

    nodeMap: new Map<string, PolyglotNode>(),
    edgeMap: new Map<string, PolyglotEdge>(),
    reactFlowNodes: () =>
      Array.from(get().nodeMap.values()).map((node) =>
        Object.assign({}, node.reactFlow)
      ),
    reactFlowEdges: () =>
      Array.from(get().edgeMap.values()).map((edge) =>
        Object.assign({}, edge.reactFlow)
      ),

    selectedElement: null,
    selectedNode: null,
    selectedEdge: null,
    getSelectedElement: () => {
      const state = get();
      const selectedElement = state.selectedElement;
      if (!selectedElement) return undefined;

      switch (selectedElement.type) {
        case 'Node':
          return state.nodeMap.get(selectedElement.id);
        case 'Edge':
          return state.edgeMap.get(selectedElement.id);
        default:
          console.log('Invalid selected type!');
          return undefined;
      }
    },
    getSelectedNode: () => {
      const state = get();
      if (state.selectedNode !== null) {
        return state.nodeMap.get(state.selectedNode)!;
      }
      return null;
    },
    getSelectedEdge: () => {
      const state = get();
      if (state.selectedEdge !== null) {
        return state.edgeMap.get(state.selectedEdge)!;
      }
      return null;
    },
    setSelectedElement: (element) => {
      set(() => ({
        selectedElement: element,
      }));
    },
    setSelectedNode: (nodeId: string) => {
      set(() => ({
        selectedNode: nodeId,
        selectedEdge: null,
      }));
    },
    setSelectedEdge: (edgeId: string) => {
      set(() => ({
        selectedNode: null,
        selectedEdge: edgeId,
      }));
    },
    clearSelection: () => {
      set(() => ({
        selectedElement: null,
        selectedNode: null,
        selectedEdge: null,
      }));
    },

    applyNodeChanges: (changes: Node[]) => {
      set((state) =>
        produce(state, (draft) => {
          changes.forEach((change) => {
            const node = draft.nodeMap.get(change.id)!;
            node.reactFlow = merge(node.reactFlow, change);
          });
        })
      );
    },
    applyEdgeChanges: (changes: Edge[]) => {
      set((state) =>
        produce(state, (draft) => {
          changes.forEach((change) => {
            const edge = draft.edgeMap.get(change.id)!;
            edge.reactFlow = merge(edge.reactFlow, change);
          });
        })
      );
    },
    addSubFlow: (flow: PolyglotFlow) => {
      set((state) =>
        produce(state, (draft) => {
          if (flow.nodes) {
            const subflowNodeMap = createElementMapping(flow.nodes);
            subflowNodeMap.forEach((v, k) => draft.nodeMap.set(k, v));
          }
          if (flow.edges) {
            const subflowEdgeMap = createElementMapping(flow.edges);
            subflowEdgeMap.forEach((v, k) => draft.edgeMap.set(k, v));
          }
          draft.clearSelection();
        })
      );
    },
    addNode: (initialValue: PolyglotNode) => {
      set((state) =>
        produce(state, (draft) => {
          draft.nodeMap.set(initialValue.reactFlow.id, initialValue);
        })
      );
    },
    updateNode: (id: string, newValue: PartialDeep<PolyglotNode>) => {
      set((state) =>
        produce(state, (draft) => {
          const node = draft.nodeMap.get(id);
          if (!node) {
            console.log('Node not present!');
            return;
          }
          const mergeVal = merge<PolyglotNode>(node, newValue as PolyglotNode);
          if (!mergeVal) {
            console.log('error merging');
            return;
          }
          // TODO: FIXME: make sure that newValue as PolyglotNode is correct!!!
          draft.nodeMap.set(id, mergeVal);
        })
      );
    },
    removeNode: (id: string) => {
      set((state) =>
        produce(state, (draft) => {
          draft.nodeMap.delete(id);
          Object.entries(draft.edgeMap).forEach(([edgeId, edge]) => {
            if (edge.reactFlow.source === id || edge.reactFlow.target === id) {
              draft.edgeMap.delete(edgeId);
            }
          });
        })
      );
    },

    addEdge: (initialValue: PolyglotEdge) => {
      set((state) =>
        produce(state, (draft) => {
          draft.edgeMap.set(initialValue.reactFlow.id, initialValue);
        })
      );
    },
    updateEdge: (id: string, newValue: PartialDeep<PolyglotEdge>) => {
      set((state) =>
        produce(state, (draft) => {
          // TODO: FIXME: make sure that newValue as PolyglotEdge is correct!!!
          draft.edgeMap.set(
            id,
            merge<PolyglotEdge>(
              draft.edgeMap.get(id)!,
              newValue as PolyglotEdge
            )
          );
        })
      );
    },
    removeEdge: (id: string) => {
      set((state) =>
        produce(state, (draft) => {
          draft.edgeMap.delete(id);
        })
      );
    },

    onConnect: (connection: Connection) => {
      set((state) =>
        produce(state, (draft) => {
          const newEdge = createNewDefaultPolyglotEdge(
            connection.source!,
            connection.target!
          );
          draft.edgeMap.set(newEdge.reactFlow.id, newEdge);
        })
      );
    },
  }))
);

export const curriedUpdate = <T>(
  updateFunc: (id: string, newValue: PartialDeep<T>) => void,
  id: string
) => {
  return (newValue: PartialDeep<T>) => {
    updateFunc(id, newValue);
  };
};

// TODO: remove duplication here
export const changeNodeType = (currentValue: PolyglotNode, newType: string) => {
  if (
    !Object.keys(polyglotNodeComponentMapping.nameMapping).includes(newType)
  ) {
    console.error('Unknown node type: ' + newType);
    return;
  }

  // copy only general properties
  const newObj = Object.keys(PolyglotNode_IoTs.props).reduce((acc, prop) => {
    acc[prop] = (currentValue as any)[prop];
    return acc;
  }, {} as any) as PolyglotNode;
  newObj.reactFlow = Object.assign({}, currentValue.reactFlow);

  // reset data to newType default
  newObj.data = polyglotNodeComponentMapping.defaultDataMapping[newType];

  // actually update type
  newObj.type = newType;
  newObj.reactFlow.type = newType;

  console.log(newObj);
  const state = useStore.getState();
  state.removeNode(currentValue.reactFlow.id);
  state.addNode(newObj);
};

export const changeEdgeType = (currentValue: PolyglotEdge, newType: string) => {
  if (
    !Object.keys(polyglotEdgeComponentMapping.nameMapping).includes(newType)
  ) {
    console.error('Unknown edge type: ' + newType);
    return;
  }

  // copy only general properties
  const propsArray = PolyglotEdge_IoTs.types.reduce(
    (acc, t) => ({ ...acc, ...t.props }),
    {} as object
  );
  const newObj = Object.keys(propsArray).reduce((acc, prop) => {
    acc[prop] = (currentValue as any)[prop];
    return acc;
  }, {} as any) as PolyglotEdge;
  newObj.reactFlow = Object.assign({}, currentValue.reactFlow);

  // reset data to newType default
  newObj.data = polyglotEdgeComponentMapping.defaultDataMapping[newType];

  // actually update type
  newObj.type = newType;
  newObj.reactFlow.type = newType;

  console.log(newObj);
  const state = useStore.getState();
  state.removeEdge(currentValue.reactFlow.id);
  state.addEdge(newObj);
};

export default useStore;
