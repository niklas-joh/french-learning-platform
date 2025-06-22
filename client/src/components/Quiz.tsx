import React from 'react';
import { Content, MultipleChoiceData, FillInTheBlankData, TrueFalseData } from '../types/Content';
import MultipleChoiceQuiz from './quiz_types/MultipleChoiceQuiz';
import FillInTheBlankQuiz from './quiz_types/FillInTheBlankQuiz';
import TrueFalseQuiz from './quiz_types/TrueFalseQuiz';
import { Typography } from '@mui/material';

interface QuizProps {
  content: Content;
}

const Quiz: React.FC<QuizProps> = ({ content }) => {
  switch (content.type) {
    case 'multiple-choice':
      return <MultipleChoiceQuiz data={content.questionData as MultipleChoiceData} />;
    case 'fill-in-the-blank':
      return <FillInTheBlankQuiz data={content.questionData as FillInTheBlankData} />;
    case 'true-false':
      return <TrueFalseQuiz data={content.questionData as TrueFalseData} />;
    default:
      return <Typography>Unsupported content type: {content.type}</Typography>;
  }
};

export default Quiz;
