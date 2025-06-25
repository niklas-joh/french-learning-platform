export interface Feedback {
  correct: string;
  incorrect: string;
}

// For 'multiple-choice'
export interface MultipleChoiceData {
  text: string;
  options: string[];
  correctAnswer: string; // The actual answer string
  explanation: string;
  feedback: Feedback;
}

// For 'fill-in-the-blank'
export interface FillInTheBlankData {
  text: string; // e.g., "The cat sat on the ___."
  correctAnswer: string; // e.g., "mat"
  explanation: string;
  feedback: Feedback;
}

// For 'true-false'
export interface TrueFalseData {
  statement: string;
  correctAnswer: boolean;
  explanation: string;
  feedback: Feedback;
}

// For 'sentence-correction'
export interface SentenceCorrectionData {
  text: string;
  correctAnswer: string;
  explanation?: string;
  feedback: Feedback;
}

export interface Content {
  id: number;
  name: string;
  title: string;
  topicId: number;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'true-false' | 'sentence-correction';
  contentTypeId: number;
  questionData: MultipleChoiceData | FillInTheBlankData | TrueFalseData | SentenceCorrectionData;
  active: boolean;
  createdAt?: string;
  options?: string[];
  correct_answer?: string;
}
