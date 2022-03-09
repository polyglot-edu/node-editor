import { HandleProps } from 'react-flow-renderer';
import { NodeType } from '.';

export type HandleData = {
    handleProps: HandleProps;
}

export interface NodeData {
    label: string;
}

export interface PolyglotNode {
    id: string;
    // TODO: change string to enum with string representation
    type: NodeType;
    title: string;
    data: NodeData;
    position: { x: number; y: number };
    description: string;
    // TODO: remove optional from here: it's only for development
    handleData?: HandleData[];
}
