import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LearningJourneysSection: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 4, textAlign: 'center', backgroundColor: 'action.hover' }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Learning Journeys
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Coming Soon! Plan and track your personalized learning paths here.
      </Typography>
    </Paper>
  );
};

export default LearningJourneysSection;
