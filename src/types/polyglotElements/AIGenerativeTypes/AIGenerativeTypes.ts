export enum TypeOfExercise {
  fill_in_the_blanks,
  question,
  choice,
  conceptual,
  practical,
}

export type AnalyseType = { material: string };

export type LOType = {
  Topic: string;
  Level: number;
  Context: string;
};

export type MaterialType = {
  topic: string;
  numberOfWords: number;
  level: number;
  learningObjective: string;
};

export type SummarizeType = {
  material: string;
  numberOfWords: number;
  level: number;
};

export type AIExerciseType = {
  macroSubject: string;
  title: string;
  level: number; //0=primary_school, 1=middle_school, 2=high_school, 3=college, 4=academy
  typeOfActivity: TypeOfExercise; //0=fill_in_the_blanks, 1=question, 2=choice, 3=conceptual, 4=practical
  learningObjective?: string;
  bloomLevel: number; //0=Remembering, 1=Understanding, 2=Applying, 3=Analyzing, 4=Evaluating, 5=Creating
  language: string;
  material: string;
  correctAnswersNumber?: number;
  distractorsNumber?: number;
  easilyDiscardableDistractorsNumber?: number;
  assignmentType: number; //0=theoretical, 1=code, 2=problem_resolution,
  topic: string;
  temperature: number;
};

export type SummarizerBody = { lesson: string; noW: string; level: string };
