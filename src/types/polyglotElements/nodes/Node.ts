import { HandleProps } from 'react-flow-renderer';

export type HandleData = {
    handleProps: HandleProps;
}

export interface NodeData {
    label: string;
}

export abstract class PolyglotNode {
    abstract id: string;
    abstract type: string;
    abstract title: string;
    abstract data: NodeData;
    abstract position: { x: number; y: number };
    abstract description: string;
    // TODO: remove optional from here: it's only for development
    abstract handleData?: HandleData[];
}