import React from 'react';
import { Box, Typography } from '@mui/material';

interface TrueFalseSpecificFormProps {
  data: any;
  onChange: (newData: any) => void;
}

const TrueFalseSpecificForm: React.FC<TrueFalseSpecificFormProps> = ({ data, onChange }) => {
  // TODO: Implement the actual form for true/false questions
  return (
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
      <Typography variant="h6">True/False Form</Typography>
      <Typography variant="body2">
        Form fields for the statement and the correct answer (true/false) will go here.
      </Typography>
    </Box>
  );
};

export default TrueFalseSpecificForm;
