import { Edge } from "react-flow-renderer";

export interface EdgeData {
    // duplicate data because the object returned by the react-flow callback lacks some data
    label: string;
    conditions: string[];
}

export type PolyglotEdge = Edge & {
    type: string;
    kind: string;
    data: EdgeData;
}