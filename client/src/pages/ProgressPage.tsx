import React from 'react';
import { Box, Typography } from '@mui/material';

const ProgressPage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Your Progress
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Gamified analytics and progress tracking are coming soon!
      </Typography>
    </Box>
  );
};

export default ProgressPage;
