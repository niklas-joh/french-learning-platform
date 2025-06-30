import React from 'react';
import { Box, Typography } from '@mui/material';

const PracticePage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Practice
      </Typography>
      <Typography variant="body1">
        Practice activities will be here.
      </Typography>
    </Box>
  );
};

export default PracticePage;
