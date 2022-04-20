import create from "zustand";
import { devtools } from 'zustand/middleware'
import { Node, Edge, Connection, MarkerType } from "react-flow-renderer";
import { loadFlowElements } from "./data/flowElements";
import { PolyglotEdge, PolyglotNode } from "./types/polyglotElements";
import { merge } from "@fluentui/react";
import type { PartialDeep } from "type-fest";
import produce from "immer";
import { v4 as UUIDv4 } from 'uuid';
import { PassFailEdge } from "./types/polyglotElements/edges/PassFailEdge";


const flowElements = loadFlowElements();

function createElementMapping<T extends (PolyglotNode | PolyglotEdge)>(arr: T[]) {
    return arr.reduce((acc, el) => {
        acc[el.id] = el;
        return acc;
    }, {} as Record<string, T>);
}

interface ApplicationState {
    nodeMap: Record<string, PolyglotNode>;
    edgeMap: Record<string, PolyglotEdge>;
    nodes: () => PolyglotNode[];
    edges: () => PolyglotEdge[];

    selectedNode: Nullable<string>;
    selectedEdge: Nullable<string>;
    getSelectedNode: () => Nullable<PolyglotNode>;
    getSelectedEdge: () => Nullable<PolyglotEdge>;
    setSelectedNode: (nodeId: string) => void;
    setSelectedEdge: (edgeId: string) => void;
    clearSelection: () => void;

    applyNodeChanges: (changes: Node[]) => void;
    applyEdgeChanges: (changes: Edge[]) => void;

    addNode: (initialValue: PolyglotNode) => void;
    updateNode: (id: string, newValue: PartialDeep<PolyglotNode>) => void;
    removeNode: (id: string) => void;

    addEdge: (initialValue: PolyglotEdge) => void;
    updateEdge: (id: string, newValue: PartialDeep<PolyglotEdge>) => void;
    removeEdge: (id: string) => void;

    onConnect: (connection: Connection) => void;
}

const useStore = create<ApplicationState>(devtools((set, get) => ({
    nodeMap: createElementMapping(flowElements.nodes),
    edgeMap: createElementMapping(flowElements.edges),
    nodes: () => Object.entries(get().nodeMap).map(([_, node]) => Object.assign({}, node)),
    edges: () => Object.entries(get().edgeMap).map(([_, edge]) => Object.assign({}, edge)),

    selectedNode: null,
    selectedEdge: null,
    getSelectedNode: () => {
        const state = get();
        if (state.selectedNode !== null) {
            return state.nodeMap[state.selectedNode];
        }
        return null;
    },
    getSelectedEdge: () => {
        const state = get();
        if (state.selectedEdge !== null) {
            return state.edgeMap[state.selectedEdge];
        }
        return null;
    },
    setSelectedNode: (nodeId: string) => {
        set(() => ({
            selectedNode: nodeId,
            selectedEdge: null
        }));
    },
    setSelectedEdge: (edgeId: string) => {
        set(() => ({
            selectedNode: null,
            selectedEdge: edgeId
        }));
    },
    clearSelection: () => {
        set(() => ({
            selectedNode: null,
            selectedEdge: null
        }));
    },

    applyNodeChanges: (changes: Node[]) => {
        set(produce(draft => {
            changes.forEach(change => {
                draft.nodeMap[change.id] = merge<PolyglotNode>(draft.nodeMap[change.id], change);
            });
        }));
    },
    applyEdgeChanges: (changes: Edge[]) => {
        set(produce(draft => {
            changes.forEach(change => {
                draft.edgeMap[change.id] = merge<PolyglotEdge>(draft.edgeMap[change.id], change);
            });
        }));
    },

    addNode: (initialValue: PolyglotNode) => {
        set(produce(draft => {
            draft.nodeMap[initialValue.id] = initialValue;
        }));
    },
    updateNode: (id: string, newValue: PartialDeep<PolyglotNode>) => {
        set(produce(draft => {
            draft.nodeMap[id] = merge(draft.nodeMap[id], newValue);
        }));
    },
    removeNode: (id: string) => {
        set(produce(draft => {
            delete draft.nodeMap[id];
        }));
    },

    addEdge: (initialValue: PolyglotEdge) => {
        set(produce(draft => {
            draft.edgeMap[initialValue.id] = initialValue;
        }));
    },
    updateEdge: (id: string, newValue: PartialDeep<PolyglotEdge>) => {
        set(produce(draft => {
            draft.edgeMap[id] = merge(draft.edgeMap[id], newValue);
        }));
    },
    removeEdge: (id: string) => {
        set(produce(draft => {
            delete draft.edgeMap[id];
        }));
    },

    onConnect: (connection: Connection) => {
        set(produce(draft => {
            const newEdge: PassFailEdge = {
                id: UUIDv4(),
                title: "",
                source: connection.source!,
                target: connection.target!,
                type: "passFailEdge",
                data: {
                    conditionKind: "pass",
                },
                markerEnd: {
                    type: MarkerType.Arrow,
                    width: 25,
                    height: 25,
                }
            }
            draft.edgeMap[newEdge.id] = newEdge;
        }))
    },
})));

export const curriedUpdate = <T>(updateFunc: (id: string, newValue: PartialDeep<T>) => void, id: string) => {
    return (newValue: PartialDeep<T>) => {
        updateFunc(id, newValue);
    };
};

export default useStore;