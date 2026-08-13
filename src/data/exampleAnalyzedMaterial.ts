import {
  AnalyzedMaterial,
  EducationLevel,
  LearningOutcome,
} from '../types/polyglotElements/AIGenerativeTypes/AIGenerativeTypes';

// Mirrors what a real analyseMaterial call returns, so "Insert example" can
// fill the manual-mode form without hitting the AI API — lets us test the
// rest of the flow (node generation, save, etc.) without burning tokens.
export const EXAMPLE_ANALYZED_MATERIAL: AnalyzedMaterial = {
  title: "L'impero Romano",
  macro_subject: 'Storia',
  education_level: EducationLevel.ElementarySchool,
  learning_outcome: LearningOutcome.RecallRecognize,
  language: 'Italian',
  topics: [
    {
      topic: 'La leggenda di Romolo e Remo',
      explanation:
        'Secondo la leggenda, Roma fu fondata da Romolo, che uccise suo fratello Remo dopo una disputa.',
    },
    {
      topic: 'La fondazione di Roma',
      explanation:
        'Si dice che Roma fu fondata nel 753 a.C. ed ebbe origine come un piccolo villaggio sul fiume Tevere.',
    },
    {
      topic: 'Le case romane',
      explanation:
        'I ricchi vivevano in domus, case grandi e decorate; i poveri vivevano in insulae, edifici affollati.',
    },
    {
      topic: 'Il cibo dei romani',
      explanation:
        'I romani mangiavano pane, olive, formaggio e frutta; i più ricchi potevano permettersi piatti più elaborati.',
    },
  ],
  keywords: ['Ancient Rome', 'Roman Empire', 'Mythology', 'Daily Life'],
  prerequisites: [],
  estimated_duration: 100,
};
