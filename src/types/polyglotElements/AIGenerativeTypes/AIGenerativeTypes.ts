export enum EducationLevel {
  ElementarySchool = 'elementary school',
  MiddleSchool = 'middle school',
  HighSchool = 'high school',
  College = 'college',
  Graduate = 'graduate',
  Professional = 'professional',
}

export enum LearningOutcome {
  RecallRecognize = 'the ability to recall or recognize simple facts and definitions',
  ExplainRelate = 'the ability to explain concepts and principles, and recognize how different ideas are related',
  ApplyKnowledge = 'the ability to apply knowledge and perform operations in practical contexts',
  SelfAssess = 'the ability to assess your own understanding, identify gaps in knowledge, and strategize ways to close those gaps',
  SynthesizeOrganize = 'the ability to synthesize and organize concepts into a framework that allows for advanced problem-solving and prediction',
  GenerateContribute = 'the ability to generate new knowledge, challenge existing paradigms, and make significant contributions to the field',
}

export enum QuestionType {
  OpenQuestion = 'open question',
  ShortAnswerQuestion = 'short answer question',
  TrueOrFalse = 'true or false',
  FillInTheBlanks = 'fill in the blanks',
  Matching = 'matching',
  Ordering = 'ordering',
  MultipleChoice = 'multiple choice',
  MultipleSelect = 'multiple select',
  Coding = 'coding',
  Essay = 'essay',
  KnowledgeExposition = 'knowledge exposition',
  Debate = 'debate',
  Brainstorming = 'brainstorming',
  GroupDiscussion = 'group discussion',
  Simulation = 'simulation',
  InquiryBasedLearning = 'inquiry based learning',
  NonWrittenMaterialAnalysis = 'non written material analysis',
  NonWrittenMaterialProduction = 'non written material production',
  CaseStudyAnalysis = 'case study analysis',
  ProjectBasedLearning = 'project based learning',
  ProblemSolvingActivity = 'problem solving activity',
}

export enum SummarizeStyle {
  TopicSynthetic = 'topic / synthetic',
  StandardDescriptive = 'standard descriptive',
  Abstractive = 'abstractive',
  Extractive = 'extractive',
  ExplanatoryEvaluative = 'explanatory and evaluative',
  Informal = 'informal',
  StructuredInformative = 'structured and informative',
}

export type Topic = { topic: string; explanation: string };

export type LessonNodeAI = {
  title: string;
  learning_outcome: LearningOutcome;
  topics: Topic[];
};

export type AnalyseType = { text: string; model?: string };

export type AnalyzedMaterial = {
  title: string;
  macro_subject: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  language: string;
  topics: Topic[];
  keywords: string[];
  prerequisites: string[];
  estimated_duration: number;
};

export type AIExerciseType = {
  macro_subject: string;
  topic: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  material: string;
  solutions_number: number;
  distractors_number: number;
  easily_discardable_distractors_number: number;
  type: QuestionType;
  language: string;
  model: string;
};

export type AIExerciseGenerated = {
  macro_subject: string;
  topic: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  material: string;
  assignment: string;
  plus: string;
  solutions: string[];
  distractors: string[];
  easily_discardable_distractors: string[];
  type: QuestionType;
  language: string;
};

export type LOType = {
  //outdate
  Topic: string;
  Level: number;
  Context: string;
};

export type MaterialType = {
  title: string;
  macro_subject: string;
  topics: LessonNodeAI[];
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  duration: number;
  language: string;
  model: string;
};

export type AIMaterialGenerated = {
  title: string;
  macro_subject: string;
  topics: LessonNodeAI[];
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  duration: number;
  material: string;
  language: string;
};

export type SummerizerBody = {
  text: string;
  model: string;
  style: SummarizeStyle;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
};

export type AIPlanLesson = {
  topics: Topic[];
  learning_outcome: LearningOutcome;
  language: string;
  macro_subject: string;
  title: string;
  education_level: EducationLevel;
  context: string;
  model: string;
};

export type PlanLessonNode = {
  type: string;
  topic: string;
  details: string;
  learning_outcome: LearningOutcome;
  duration: number;
};

export type AIPlanLessonResponse = {
  title: string;
  macro_subject: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  prerequisites: string[];
  nodes: PlanLessonNode[];
  context: string;
  language: string;
};
