import { PolyglotEdge, PolyglotNode } from '..';

export type PolyglotFlowInfo = {
  _id?: string;
  title: string;
  author?: {
    _id?: string;
    username?: string;
  };
  description: string;
  tags: TagTypes[];
};

export type PolyglotFlow = PolyglotFlowInfo & {
  nodes: PolyglotNode[];
  edges: PolyglotEdge[];
};

export type TagTypes = 'GREEN' | 'BUSINESS' | 'DIGITAL';

export const TagOptions: { [k in TagTypes]: { color: string } } = {
  GREEN: { color: 'green' },
  BUSINESS: { color: 'red' },
  DIGITAL: { color: 'blue' },
};
