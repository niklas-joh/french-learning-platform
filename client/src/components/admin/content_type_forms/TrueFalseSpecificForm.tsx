import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';

interface TrueFalseSpecificFormProps {
  data: {
    question?: string;
    correctAnswer?: boolean;
  };
  onChange: (newData: any) => void;
}

const TrueFalseSpecificForm: React.FC<TrueFalseSpecificFormProps> = ({ data, onChange }) => {
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);

  useEffect(() => {
    setQuestion(data?.question || '');
    setCorrectAnswer(data?.correctAnswer === undefined ? null : data.correctAnswer);
  }, [data]);

  const handleDataChange = (updatedData: any) => {
    onChange({
      ...data,
      ...updatedData,
    });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
    handleDataChange({ question: newQuestion });
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCorrectAnswer = e.target.value === 'true';
    setCorrectAnswer(newCorrectAnswer);
    handleDataChange({ correctAnswer: newCorrectAnswer });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        True/False Details
      </Typography>
      <TextField
        fullWidth
        label="Statement"
        value={question}
        onChange={handleQuestionChange}
        margin="normal"
        required
      />
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Correct Answer</FormLabel>
        <RadioGroup
          row
          aria-label="correct-answer"
          name="correct-answer-group"
          value={correctAnswer === null ? '' : String(correctAnswer)}
          onChange={handleCorrectAnswerChange}
        >
          <FormControlLabel value="true" control={<Radio />} label="True" />
          <FormControlLabel value="false" control={<Radio />} label="False" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default TrueFalseSpecificForm;
