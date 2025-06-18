export interface ApiContentItem {
  id: string;
  type: string;
  topic: string;
  difficultyLevel?: string;
  tags?: string[];
  questionData: {
    text: string;
    explanation: string;
  };
  options: string[];
  correctAnswer: number;
  feedback?: {
    correct: string;
    incorrect: string;
  };
}

import { QuizData } from '../components/Quiz';

export function mapApiContentToQuizData(item: ApiContentItem): QuizData {
  return {
    id: item.id,
    type: item.type,
    topic: item.topic,
    difficulty: item.difficultyLevel || '',
    tags: item.tags || [],
    question: {
      text: item.questionData.text,
      explanation: item.questionData.explanation,
    },
    options: item.options,
    correct_answer: item.correctAnswer,
    feedback: item.feedback || { correct: '', incorrect: '' },
  };
}
