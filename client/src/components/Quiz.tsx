import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
  Alert,
} from '@mui/material';
// import { QuizData } from '../pages/DashboardPage'; // Removed import

// Define QuizData interface directly in this file
export interface QuizData {
  id: string;
  type: string;
  topic: string;
  difficulty: string;
  tags: string[];
  question: {
    text: string;
    explanation: string;
  };
  options: string[];
  correct_answer: number;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

interface QuizProps {
  quizData: QuizData;
}

const Quiz: React.FC<QuizProps> = ({ quizData }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const selectedOptionIndex = quizData.options.indexOf(selectedValue);
  const isCorrect = isSubmitted && selectedOptionIndex === quizData.correct_answer;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {quizData.question.text}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              aria-label="quiz"
              name="quiz"
              value={selectedValue}
              onChange={handleRadioChange}
            >
              {quizData.options.map((option: string, index: number) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={isSubmitted}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!selectedValue || isSubmitted}
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
            {isCorrect ? 'Correct!' : 'Incorrect.'}
            <Typography variant="body2">
              {quizData.feedback[isCorrect ? 'correct' : 'incorrect']}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Explanation:</strong> {quizData.question.explanation}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default Quiz;
