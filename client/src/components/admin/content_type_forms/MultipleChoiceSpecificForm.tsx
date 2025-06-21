import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Radio,
  FormControlLabel,
  List,
  ListItem,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface MultipleChoiceSpecificFormProps {
  data: {
    question?: string;
    options?: string[];
    correctAnswer?: string;
  };
  onChange: (newData: any) => void;
}

const MultipleChoiceSpecificForm: React.FC<MultipleChoiceSpecificFormProps> = ({ data, onChange }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    setQuestion(data?.question || '');
    setOptions(data?.options || ['', '']);
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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    handleDataChange({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...options, ''];
    setOptions(newOptions);
    handleDataChange({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    handleDataChange({ options: newOptions });
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCorrectAnswer = e.target.value;
    setCorrectAnswer(newCorrectAnswer);
    handleDataChange({ correctAnswer: newCorrectAnswer });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Multiple Choice Details
      </Typography>
      <TextField
        fullWidth
        label="Question"
        value={question}
        onChange={handleQuestionChange}
        margin="normal"
        required
      />
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Options
      </Typography>
      <List>
        {options.map((option, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FormControlLabel
              value={option}
              control={
                <Radio
                  checked={correctAnswer === option}
                  onChange={handleCorrectAnswerChange}
                  name="correct-answer-radio"
                />
              }
              label={`Option ${index + 1}`}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              size="small"
              sx={{ flexGrow: 2, mr: 1 }}
            />
            <IconButton onClick={() => handleRemoveOption(index)} size="small" disabled={options.length <= 2}>
              <RemoveCircleOutline />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button
        startIcon={<AddCircleOutline />}
        onClick={handleAddOption}
        variant="outlined"
        size="small"
      >
        Add Option
      </Button>
    </Box>
  );
};

export default MultipleChoiceSpecificForm;
