import React from 'react';
import { Content } from '../types/Content';
import MultipleChoiceQuiz from './quiz_types/MultipleChoiceQuiz';
import FillInTheBlankQuiz from './quiz_types/FillInTheBlankQuiz';
import TrueFalseQuiz from './quiz_types/TrueFalseQuiz';
import SentenceCorrectionQuiz from './quiz_types/SentenceCorrectionQuiz';
import { Typography } from '@mui/material';

interface QuizProps {
  content: Content;
  onAnswer: (isCorrect: boolean) => void;
}

const Quiz: React.FC<QuizProps> = ({ content, onAnswer }) => {
  switch (content.type) {
    case 'multiple-choice':
      return <MultipleChoiceQuiz content={content} onAnswer={onAnswer} />;
    case 'fill-in-the-blank':
      return <FillInTheBlankQuiz content={content} onAnswer={onAnswer} />;
    case 'true-false':
      return <TrueFalseQuiz content={content} onAnswer={onAnswer} />;
    case 'sentence-correction':
      return <SentenceCorrectionQuiz content={content} onAnswer={onAnswer} />;
    default:
      return <Typography>Unsupported content type: {content.type}</Typography>;
  }
};

export default Quiz;
