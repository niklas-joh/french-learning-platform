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
import { Content, TrueFalseData } from '../../types/Content';

interface TrueFalseQuizProps {
  content: Content;
  onAnswer: (isCorrect: boolean) => void;
}

const TrueFalseQuiz: React.FC<TrueFalseQuizProps> = ({ content, onAnswer }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const data = content.questionData as TrueFalseData;
=======
import { TrueFalseData } from '../../types/Content';

interface TrueFalseQuizProps {
  data: TrueFalseData;
}

const TrueFalseQuiz: React.FC<TrueFalseQuizProps> = ({ data }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
>>>>>>> 6f552ce (feat(content): Implement multiple content types for quizzes)

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
<<<<<<< HEAD
    const isCorrect = (selectedValue === 'true') === data.correctAnswer;
    setIsSubmitted(true);
    onAnswer(isCorrect);
=======
    setIsSubmitted(true);
>>>>>>> 6f552ce (feat(content): Implement multiple content types for quizzes)
  };

  const isCorrect = isSubmitted && (selectedValue === 'true') === data.correctAnswer;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {data.statement}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              aria-label="quiz"
              name="quiz"
              value={selectedValue}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="True"
                disabled={isSubmitted}
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="False"
                disabled={isSubmitted}
              />
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

export default TrueFalseQuiz;
