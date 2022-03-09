export interface EdgeData {
    // duplicate data because the object returned by the react-flow callback lacks some data
    label: string;
    conditions: string[];
}

export interface PolyglotEdge {
    id: string;
    source: string;
    target: string;
    type: string;
    // TODO: remove optional from here: it's only for development
    sourceHandle?: string;
    // TODO: remove optional from here: it's only for development
    targetHandle?: string;
    label: string;
    data: EdgeData;
}