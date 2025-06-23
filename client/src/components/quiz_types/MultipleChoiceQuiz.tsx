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
<<<<<<< HEAD
import { MultipleChoiceData } from '../../types/Content';

interface MultipleChoiceQuizProps {
  data: MultipleChoiceData;
}

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ data }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
=======
import { Content, MultipleChoiceData } from '../../types/Content';

interface MultipleChoiceQuizProps {
  content: Content;
  onAnswer: (isCorrect: boolean) => void;
}

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ content, onAnswer }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const data = content.questionData as MultipleChoiceData;
>>>>>>> main

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
<<<<<<< HEAD
    setIsSubmitted(true);
=======
    const selectedOptionIndex = data.options.indexOf(selectedValue);
    const isCorrect = selectedOptionIndex === data.correctAnswer;
    setIsSubmitted(true);
    onAnswer(isCorrect);
>>>>>>> main
  };

  const selectedOptionIndex = data.options.indexOf(selectedValue);
  const isCorrect = isSubmitted && selectedOptionIndex === data.correctAnswer;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {data.text}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              aria-label="quiz"
              name="quiz"
              value={selectedValue}
              onChange={handleRadioChange}
            >
              {data.options.map((option: string, index: number) => (
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
              {data.explanation}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceQuiz;
