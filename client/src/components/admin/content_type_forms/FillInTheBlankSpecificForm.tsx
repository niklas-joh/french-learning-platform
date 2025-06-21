import React from 'react';
import { Box, Typography } from '@mui/material';

interface FillInTheBlankSpecificFormProps {
  data: any;
  onChange: (newData: any) => void;
}

const FillInTheBlankSpecificForm: React.FC<FillInTheBlankSpecificFormProps> = ({ data, onChange }) => {
  // TODO: Implement the actual form for fill-in-the-blank questions
  return (
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
      <Typography variant="h6">Fill in the Blank Form</Typography>
      <Typography variant="body2">
        Form fields for the sentence/question and the correct answer(s) will go here.
      </Typography>
    </Box>
  );
};

export default FillInTheBlankSpecificForm;
