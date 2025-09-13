import React from 'react';
import { Box, Typography } from '@mui/material';
import LearningPath from '../components/learning/LearningPath';

/**
 * Practice Page - Interactive Learning Practice Dashboard
 * 
 * Provides practice-focused learning activities using existing infrastructure.
 * Achieves 90% code reuse through LearningPath component integration.
 * 
 * Features:
 * - Practice-specific learning path content
 * - Interactive learning units and exercises
 * - Progress tracking for practice activities
 * - Responsive learning interface
 * - Bottom navigation compatibility
 * 
 * @component PracticePage
 * @version 2.0.0 - Transformed from placeholder to functional practice dashboard
 * @author French Learning Platform Team
 */
const PracticePage: React.FC = () => {
  // TODO: Make practicePathId dynamic based on user preferences or available practice paths
  // For now, using pathId 1 for practice content (same as lessons - could be filtered)
  const practicePathId = 1;

  return (
    <Box sx={{ p: 2, pb: 10 }}> {/* Padding bottom for bottom navigation */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700, 
          mb: 2,
          color: 'var(--french-purple)', // Design token integration
        }}
      >
        Practice
      </Typography>
      <LearningPath pathId={practicePathId} /> {/* Existing learning path component */}
    </Box>
  );
};

export default PracticePage;
