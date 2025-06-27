import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { Content, SentenceCorrectionData } from '../../types/Content';

interface SentenceCorrectionQuizProps {
  content: Content;
  onAnswer: (isCorrect: boolean) => void;
}

const SentenceCorrectionQuiz: React.FC<SentenceCorrectionQuizProps> = ({ content, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const data = content.questionData as SentenceCorrectionData;
  const questionText = data.text || '';
  const blank = '____';
  const parts = questionText.split(blank);

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === data.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswer(correct);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Complétez la phrase
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, my: 2 }}>
        <Typography variant="body1">{parts[0]}</Typography>
        <TextField
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          size="small"
          sx={{ width: '150px' }}
          disabled={isSubmitted}
        />
        <Typography variant="body1">{parts[1]}</Typography>
      </Box>
      <Button onClick={handleSubmit} variant="contained" disabled={isSubmitted}>
        Submit
      </Button>
      {isSubmitted && (
        <Typography variant="body1" sx={{ mt: 2, color: isCorrect ? 'green' : 'red' }}>
          {isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${data.correctAnswer}`}
        </Typography>
      )}
    </Box>
  );
};

export default SentenceCorrectionQuiz;
