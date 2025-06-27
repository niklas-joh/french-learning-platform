import React from 'react';
import { Box, Typography } from '@mui/material';

const PracticePage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Practice Center
      </Typography>
      <Typography variant="body1" color="text.secondary">
        AI-powered practice activities are coming soon!
      </Typography>
    </Box>
  );
};

export default PracticePage;
