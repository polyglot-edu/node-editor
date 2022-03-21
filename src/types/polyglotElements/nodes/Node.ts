import { Node, HandleProps } from 'react-flow-renderer';

export type HandleData = {
    handleProps: HandleProps;
}

export type NodeData = {
    label: string;
}

export type PolyglotNode = Node<unknown> & {
    type: string;
    title: string;
    description: string;
    data: NodeData;
    // TODO: remove optional from here: it's only for development
    // handleData?: HandleData[];
};