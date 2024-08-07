import { PolyglotFlow } from '../flow';

export type PolyglotCourseInfo = {
  _id?: string;
  title: string;
  description: string;
  flowsId?: string[];
  tags?: { name: string; color: string }[];
  author?: {
    _id?: string;
    username?: string;
  };
};

export type PolyglotCourse = PolyglotCourseInfo & {
  flows: PolyglotFlow[];
};

export type PolyglotCourseBody = {
  language: string;
  macroSubject: string;
  title: string;
  level: number;
  topic: string;
  numberOfLessons: number;
  lessonDuration: number;
};

export type PolyglotLessonBody = {
  mainTopics: Topic[];
  language: string;
  macroSubject: string;
  title: string;
  level: number;
  learningObjective: string;
  bloomLevel: number;
  context: string;
  temperature: number;
};

export type Topic = {
  topic: string;
  type: number;
  description: string;
};
