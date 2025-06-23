import React from 'react';
<<<<<<< HEAD
import { Content, MultipleChoiceData, FillInTheBlankData, TrueFalseData } from '../types/Content';
import MultipleChoiceQuiz from './quiz_types/MultipleChoiceQuiz';
import FillInTheBlankQuiz from './quiz_types/FillInTheBlankQuiz';
import TrueFalseQuiz from './quiz_types/TrueFalseQuiz';
=======
import { Content } from '../types/Content';
import MultipleChoiceQuiz from './quiz_types/MultipleChoiceQuiz';
import FillInTheBlankQuiz from './quiz_types/FillInTheBlankQuiz';
import TrueFalseQuiz from './quiz_types/TrueFalseQuiz';
import SentenceCorrectionQuiz from './quiz_types/SentenceCorrectionQuiz';
>>>>>>> main
import { Typography } from '@mui/material';

interface QuizProps {
  content: Content;
<<<<<<< HEAD
}

const Quiz: React.FC<QuizProps> = ({ content }) => {
  switch (content.type) {
    case 'multiple-choice':
      return <MultipleChoiceQuiz data={content.questionData as MultipleChoiceData} />;
    case 'fill-in-the-blank':
      return <FillInTheBlankQuiz data={content.questionData as FillInTheBlankData} />;
    case 'true-false':
      return <TrueFalseQuiz data={content.questionData as TrueFalseData} />;
=======
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
>>>>>>> main
    default:
      return <Typography>Unsupported content type: {content.type}</Typography>;
  }
};

export default Quiz;
