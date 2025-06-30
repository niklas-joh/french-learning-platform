import React from 'react';
import {
  LessonComponentProps,
  ConversationContent,
} from '../../../types/LessonContentTypes';
import LessonContentContainer from './LessonContentContainer';
import { Typography, Box, Paper } from '@mui/material';

const ConversationLesson: React.FC<LessonComponentProps<ConversationContent>> = ({
  content,
}) => {
  if (!content || !content.dialogue) {
    return (
      <LessonContentContainer title="Conversation">
        <Typography>No conversation content available.</Typography>
      </LessonContentContainer>
    );
  }

  return (
    <LessonContentContainer title={content.title || 'Conversation'}>
      <Box>
        {content.dialogue.map((line, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 2,
              mt: 1,
              backgroundColor:
                line.speaker === 'User'
                  ? 'primary.light'
                  : 'background.paper',
              textAlign: line.speaker === 'User' ? 'right' : 'left',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {line.speaker}
            </Typography>
            <Typography variant="body1">{line.line}</Typography>
          </Paper>
        ))}
      </Box>
    </LessonContentContainer>
  );
};

export default ConversationLesson;
