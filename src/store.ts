import create from "zustand";
import { devtools } from 'zustand/middleware'
import { Node, Edge, Connection, MarkerType } from "react-flow-renderer";
import { loadFlowElements } from "./data/flowElementsExample";
import { PolyglotEdge, polyglotEdgeComponentMapping, PolyglotEdge_IoTs, PolyglotNode, polyglotNodeComponentMapping, PolyglotNode_IoTs } from "./types/polyglotElements";
import { merge } from "@fluentui/react";
import type { PartialDeep } from "type-fest";
import produce from "immer";
import { v4 as UUIDv4 } from 'uuid';
import { PassFailEdge } from "./types/polyglotElements/edges/PassFailEdge";


const flowElements = loadFlowElements();

function createElementMapping<T extends (PolyglotNode | PolyglotEdge)>(arr: T[]) {
    return arr.reduce((acc, el) => {
        acc[el.reactFlow.id] = el;
        return acc;
    }, {} as Record<string, T>);
}

interface ApplicationState {
    nodeMap: Record<string, PolyglotNode>;
    edgeMap: Record<string, PolyglotEdge>;
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
    reactFlowNodes: () => Object.entries(get().nodeMap).map(([_, node]) => Object.assign({}, node.reactFlow)),
    reactFlowEdges: () => Object.entries(get().edgeMap).map(([_, edge]) => Object.assign({}, edge.reactFlow)),

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
        set(state => (produce(state, draft => {
            changes.forEach(change => {
                draft.nodeMap[change.id].reactFlow = merge(draft.nodeMap[change.id].reactFlow, change);
            });
        })));
    },
    applyEdgeChanges: (changes: Edge[]) => {
        set(state => (produce(state, draft => {
            changes.forEach(change => {
                draft.edgeMap[change.id].reactFlow = merge(draft.edgeMap[change.id].reactFlow, change);
            });
        })));
    },

    addNode: (initialValue: PolyglotNode) => {
        set(state => (produce(state, draft => {
            draft.nodeMap[initialValue.reactFlow.id] = initialValue;
        })));
    },
    updateNode: (id: string, newValue: PartialDeep<PolyglotNode>) => {
        set(state => (produce(state, draft => {
            // TODO: FIXME: make sure that newValue as PolyglotNode is correct!!!
            draft.nodeMap[id] = merge<PolyglotNode>(draft.nodeMap[id], newValue as PolyglotNode);
        })));
    },
    removeNode: (id: string) => {
        set(state => (produce(state, draft => {
            delete draft.nodeMap[id];
        })));
    },

    addEdge: (initialValue: PolyglotEdge) => {
        set(state => (produce(state, draft => {
            draft.edgeMap[initialValue.reactFlow.id] = initialValue;
        })));
    },
    updateEdge: (id: string, newValue: PartialDeep<PolyglotEdge>) => {
        set(state => (produce(state, draft => {
            // TODO: FIXME: make sure that newValue as PolyglotEdge is correct!!!
            draft.edgeMap[id] = merge<PolyglotEdge>(draft.edgeMap[id], newValue as PolyglotEdge);
        })));
    },
    removeEdge: (id: string) => {
        set(state => (produce(state, draft => {
            delete draft.edgeMap[id];
        })));
    },

    onConnect: (connection: Connection) => {
        set(state => (produce(state, draft => {
            const newEdge: PassFailEdge = {
                reactFlow: {
                    id: UUIDv4(),
                    source: connection.source!,
                    target: connection.target!,
                    type: "passFailEdge",
                    markerEnd: {
                        type: MarkerType.Arrow,
                        width: 25,
                        height: 25,
                    }
                },
                type: "passFailEdge",
                title: "",
                data: {
                    conditionKind: "pass",
                },
            }
            draft.edgeMap[newEdge.reactFlow.id] = newEdge;
        })))
    },
})));

export const curriedUpdate = <T>(updateFunc: (id: string, newValue: PartialDeep<T>) => void, id: string) => {
    return (newValue: PartialDeep<T>) => {
        updateFunc(id, newValue);
    };
};

// TODO: remove duplication here
export const changeNodeType = (currentValue: PolyglotNode, newType: string) => {
    if (!Object.keys(polyglotNodeComponentMapping.nameMapping).includes(newType)) {
        console.error("Unknown node type: " + newType);
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
    if (!Object.keys(polyglotEdgeComponentMapping.nameMapping).includes(newType)) {
        console.error("Unknown edge type: " + newType);
        return;
    }

    // copy only general properties
    const newObj = Object.keys(PolyglotEdge_IoTs.props).reduce((acc, prop) => {
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