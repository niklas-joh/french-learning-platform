import React from 'react';
import { Box, Typography } from '@mui/material';

const ProgressPage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Progress
      </Typography>
      <Typography variant="body1">
        Your progress will be displayed here.
      </Typography>
    </Box>
  );
};

export default ProgressPage;
