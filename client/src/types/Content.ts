// For 'multiple-choice'
export interface MultipleChoiceData {
  text: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

// For 'fill-in-the-blank'
export interface FillInTheBlankData {
  text: string; // e.g., "The cat sat on the ___."
  correctAnswer: string; // e.g., "mat"
  explanation: string;
}

// For 'true-false'
export interface TrueFalseData {
  statement: string;
  correctAnswer: boolean;
  explanation: string;
}

export interface Content {
  id: number;
  name: string;
  topicId: number;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'true-false';
  contentTypeId: number;
  questionData: MultipleChoiceData | FillInTheBlankData | TrueFalseData;
  active: boolean;
  createdAt?: string;
}
