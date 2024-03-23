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
  /* to be discussed: do we want to save in the database the last summarized material of the professor? Or we give the tool to be live usage?
  sourceMaterial?: string;
  levelMaterial?: string;
  generatedMaterial?: string;
  noW?: number;*/
};

export type PolyglotFlow = PolyglotFlowInfo & {
  nodes: PolyglotNode[];
  edges: PolyglotEdge[];
};

export type PolyglotExecutionNext = {
  language: string;
  text: string;
  type: number;
  level: number;
  category: number;
  temperature: number;
};

export type SummarizerBody = { lesson: string; noW: string; level: string };
