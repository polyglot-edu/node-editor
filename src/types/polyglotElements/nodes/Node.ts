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
    difficulty: number;
    data: NodeData;
    // TODO: remove optional from here: it's only for development
    // handleData?: HandleData[];
};

// TODO: add type TextualQuestion or similar to standardize textual questions such as multiple choice, open questions, coding exercises, ecc.