import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import { Content, FillInTheBlankData } from '../../types/Content';

interface FillInTheBlankQuizProps {
  content: Content;
  onAnswer: (isCorrect: boolean) => void;
}

const FillInTheBlankQuiz: React.FC<FillInTheBlankQuizProps> = ({ content, onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const data = content.questionData as FillInTheBlankData;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isCorrect = answer.trim().toLowerCase() === data.correctAnswer.toLowerCase();
    setIsSubmitted(true);
    onAnswer(isCorrect);
  };

  const isCorrect = isSubmitted && answer.trim().toLowerCase() === data.correctAnswer.toLowerCase();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {data.text.replace('___', '______')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your Answer"
            variant="outlined"
            value={answer}
            onChange={handleChange}
            disabled={isSubmitted}
            sx={{ mt: 2 }}
            fullWidth
          />
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!answer || isSubmitted}
            >
              Submit
            </Button>
          </Box>
        </form>
        {isSubmitted && (
          <Alert
            severity={isCorrect ? 'success' : 'error'}
            sx={{ mt: 2 }}
          >
            {isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${data.correctAnswer}`}
            <Typography variant="body2">
              {data.explanation}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FillInTheBlankQuiz;
