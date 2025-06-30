import React from 'react';
import { Box, Typography } from '@mui/material';
import LearningPath from '../components/learning/LearningPath';

const LessonsPage: React.FC = () => {
  // TODO: The pathId is currently hardcoded. This should be made dynamic,
  // allowing the user to select different learning paths in the future.
  const pathId = 1;

  return (
    <Box sx={{ pb: 10 }}> {/* Padding bottom to avoid overlap with bottom navigation */}
      <LearningPath pathId={pathId} />
    </Box>
  );
};

export default LessonsPage;
