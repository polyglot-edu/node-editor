import { PolyglotEdge, PolyglotNode } from '..';

export type PolyglotFlowInfo = {
  _id?: string;
  title: string;
  author?: {
    _id?: string;
    username?: string;
  };
  description: string;
  tags: { name: string; color: string }[];
  publish: boolean;
  platform: string;
};

export type PolyglotFlow = PolyglotFlowInfo & {
  nodes: PolyglotNode[];
  edges: PolyglotEdge[];
};

export type AIQuestionType = {
  language: string;
  text: string;
  type: number;
  level: number;
  category: number;
  temperature: number;
};
export type AIMultichoiceType = {
  language: string;
  text: string;
  type: boolean;
  level: number;
  category: number;
  temperature: number;
  n_o_ca: number;
  nedd: number;
  n_o_d: number;
};
