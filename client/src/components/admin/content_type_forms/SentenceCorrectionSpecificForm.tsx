import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface SentenceCorrectionSpecificFormProps {
  data: {
    text?: string; // Changed from question to text
    correctAnswer?: string;
  };
  onChange: (newData: any) => void;
}

const SentenceCorrectionSpecificForm: React.FC<SentenceCorrectionSpecificFormProps> = ({ data, onChange }) => {
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    setQuestion(data?.text || ''); // Changed from question to text
    setCorrectAnswer(data?.correctAnswer || '');
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
    handleDataChange({ text: newQuestion }); // Changed from question to text
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCorrectAnswer = e.target.value;
    setCorrectAnswer(newCorrectAnswer);
    handleDataChange({ correctAnswer: newCorrectAnswer });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Sentence Correction Details
      </Typography>
      <TextField
        fullWidth
        label="Sentence with a blank (e.g., 'J'___'appelle Pierre.')"
        value={question}
        onChange={handleQuestionChange}
        margin="normal"
        required
        helperText="Use underscores `____` to indicate the blank space."
      />
      <TextField
        fullWidth
        label="Correct Answer"
        value={correctAnswer}
        onChange={handleCorrectAnswerChange}
        margin="normal"
        required
        helperText="The word or phrase that correctly fills the blank."
      />
    </Box>
  );
};

export default SentenceCorrectionSpecificForm;
