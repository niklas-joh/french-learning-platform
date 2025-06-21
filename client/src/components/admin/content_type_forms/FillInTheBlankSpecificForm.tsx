import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface FillInTheBlankSpecificFormProps {
  data: {
    question?: string;
    correctAnswer?: string;
  };
  onChange: (newData: any) => void;
}

const FillInTheBlankSpecificForm: React.FC<FillInTheBlankSpecificFormProps> = ({ data, onChange }) => {
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    setQuestion(data?.question || '');
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
    handleDataChange({ question: newQuestion });
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCorrectAnswer = e.target.value;
    setCorrectAnswer(newCorrectAnswer);
    handleDataChange({ correctAnswer: newCorrectAnswer });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Fill in the Blank Details
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Provide a sentence with a blank, indicated by underscores (e.g., "Le chat est \_\_\_\_ la table.").
      </Typography>
      <TextField
        fullWidth
        label="Sentence with Blank"
        value={question}
        onChange={handleQuestionChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Correct Answer"
        value={correctAnswer}
        onChange={handleCorrectAnswerChange}
        margin="normal"
        required
      />
    </Box>
  );
};

export default FillInTheBlankSpecificForm;
