import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Node, Edge, Connection } from 'react-flow-renderer';
import {
  PolyglotFlow,
  PolyglotEdge,
  polyglotEdgeComponentMapping,
  PolyglotEdge_IoTs,
  PolyglotNode,
  polyglotNodeComponentMapping,
  PolyglotNode_IoTs,
  PolyglotFlowInfo,
} from './types/polyglotElements';
import { merge } from '@fluentui/react';
import type { PartialDeep } from 'type-fest';
import produce from 'immer';
import { createNewDefaultPolyglotEdge } from './utils/utils';
import { enableMapSet } from 'immer';

enableMapSet();

function createElementMapping<T extends PolyglotNode | PolyglotEdge>(arr: T[]) {
  const mapping = new Map<string, T>();
  arr.forEach((el) => {
    mapping.set(el.reactFlow.id, el);
  });
  return mapping;
}

interface ApplicationState {
  loadFlow: (flow: PolyglotFlow) => void;
  updateFlowInfo: (newValue: PartialDeep<PolyglotFlowInfo>) => void;
  getFlow: () => Nullable<PolyglotFlow>;
  activeFlowInfo: Nullable<PolyglotFlowInfo>;
  nodeMap: Map<string, PolyglotNode>;
  edgeMap: Map<string, PolyglotEdge>;
  reactFlowNodes: () => Node[];
  reactFlowEdges: () => Edge[];

  selectedNode: Nullable<string>;
  selectedEdge: Nullable<string>;
  getSelectedNode: () => Nullable<PolyglotNode>;
  getSelectedEdge: () => Nullable<PolyglotEdge>;
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
    loadFlow: (flow: PolyglotFlow) => {
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

    selectedNode: null,
    selectedEdge: null,
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
          // TODO: FIXME: make sure that newValue as PolyglotNode is correct!!!
          draft.nodeMap.set(
            id,
            merge<PolyglotNode>(
              draft.nodeMap.get(id)!,
              newValue as PolyglotNode
            )
          );
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
