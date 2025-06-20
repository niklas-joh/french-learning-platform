import React from 'react';
import { Box, Typography } from '@mui/material';

interface MultipleChoiceSpecificFormProps {
  data: any;
  onChange: (newData: any) => void;
}

const MultipleChoiceSpecificForm: React.FC<MultipleChoiceSpecificFormProps> = ({ data, onChange }) => {
  // TODO: Implement the actual form for multiple choice questions
  return (
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
      <Typography variant="h6">Multiple Choice Form</Typography>
      <Typography variant="body2">
        Form fields for question, options, and correct answer will go here.
      </Typography>
    </Box>
  );
};

export default MultipleChoiceSpecificForm;
