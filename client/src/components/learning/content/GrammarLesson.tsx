import React from 'react';
import {
  LessonComponentProps,
  GrammarContent,
} from '../../../types/LessonContentTypes';
import LessonContentContainer from './LessonContentContainer';
import { Typography, Box, Paper } from '@mui/material';

const GrammarLesson: React.FC<LessonComponentProps<GrammarContent>> = ({
  content,
}) => {
  if (!content) {
    return (
      <LessonContentContainer title="Grammar">
        <Typography>No grammar content available.</Typography>
      </LessonContentContainer>
    );
  }

  return (
    <LessonContentContainer title="Grammar">
      <Box>
        <Typography variant="h5" gutterBottom>
          {content.rule}
        </Typography>
        <Typography variant="body1" paragraph>
          {content.explanation}
        </Typography>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Examples:
          </Typography>
          {content.examples.map((example, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, mt: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                {example}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </LessonContentContainer>
  );
};

export default GrammarLesson;
