import create from "zustand";
import { devtools } from 'zustand/middleware'
import { Node, Edge } from "react-flow-renderer";
import { loadFlowElements } from "./data/flowElements";
import { PolyglotEdge, PolyglotNode } from "./types/polyglotElements";
import { merge } from "@fluentui/react";
import type { PartialDeep } from "type-fest";


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

    updateNode(id: string, newValue: PartialDeep<PolyglotNode>): void;
    updateEdge(id: string, newValue: PartialDeep<PolyglotEdge>): void;
}

const useStore = create<ApplicationState>(devtools((set, get) => ({
    nodeMap: createElementMapping(flowElements.nodes),
    edgeMap: createElementMapping(flowElements.edges),
    nodes: () => Object.entries(get().nodeMap).map(([_, node]) => node),
    edges: () => Object.entries(get().edgeMap).map(([_, edge]) => edge),

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
        set(state => ({
            nodeMap: { ...state.nodeMap, ...Object.fromEntries(changes.map(c => ([c.id, { ...state.nodeMap[c.id], ...c } as PolyglotNode]))) },
        }));
    },
    applyEdgeChanges: (changes: Edge[]) => {
        set(state => ({
            edgeMap: { ...state.edgeMap, ...Object.fromEntries(changes.map(c => ([c.id, { ...state.edgeMap[c.id], ...c } as PolyglotEdge]))) },
        }));
    },

    updateNode: (id: string, newValue: PartialDeep<PolyglotNode>) => {
        set(state => ({
            nodeMap: { ...state.nodeMap, [id]: merge(state.nodeMap[id], newValue as Partial<PolyglotNode>) }
        }));
    },
    updateEdge: (id: string, newValue: PartialDeep<PolyglotEdge>) => {
        set(state => ({
            edgeMap: { ...state.edgeMap, [id]: merge(state.edgeMap[id], newValue as Partial<PolyglotEdge>) }
        }));
    }
})));

export const curriedUpdate = <T>(updateFunc: (id: string, newValue: PartialDeep<T>) => void, id: string) => {
    return (newValue: PartialDeep<T>) => {
        updateFunc(id, newValue);
    };
};

export default useStore;