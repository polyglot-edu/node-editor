import { Edge } from "react-flow-renderer";

export interface EdgeData {
    // duplicate data because the object returned by the react-flow callback lacks some data
    // label: string;
    // conditions: string[];
}

export type PolyglotEdge = Edge<unknown> & {
    type: string;
    kind: string;
    title: string;
    data: EdgeData;
}