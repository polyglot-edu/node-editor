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
  learningContext: string;
  duration: string;
  topics: string[];
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

export type AIQuestionType = {
  macroSubject?: string;
  title?: string;
  level: number; //0=primary_school, 1=middle_school, 2=high_school, 3=college, 4=academy
  typeOfExercise: number; //0=fill_in_the_blanks, 1=question, 2=choice, 3=conceptual, 4=practical
  learningObjective?: string;
  bloomLevel: number; //0=Remembering, 1=Understanding, 2=Applying, 3=Analyzing, 4=Evaluating, 5=Creating
  language: string;
  material: string;
  correctAnswersNumber?: number;
  distractorsNumber?: number;
  easilyDiscardableDistractorsNumber?: number;
  assignmentType: number; //0=theoretical, 1=code, 2=problem_resolution,
  topic?: string;
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

export type SummarizerBody = { lesson: string; noW: string; level: string };
