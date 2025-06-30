import React from 'react';
import {
  LessonComponentProps,
  VocabularyContent,
} from '../../../types/LessonContentTypes';
import LessonContentContainer from './LessonContentContainer';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const VocabularyLesson: React.FC<LessonComponentProps<VocabularyContent>> = ({
  content,
}) => {
  if (!content || !content.items) {
    return (
      <LessonContentContainer title="Vocabulary">
        <Typography>No vocabulary content available.</Typography>
      </LessonContentContainer>
    );
  }

  return (
    <LessonContentContainer title="Vocabulary">
      <List>
        {content.items.map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={
                <Typography variant="h6" component="span">
                  {item.word}
                </Typography>
              }
              secondary={
                <>
                  <Typography component="span" variant="body1" color="text.primary">
                    {item.translation}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    <em>{item.example_sentence}</em>
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </LessonContentContainer>
  );
};

export default VocabularyLesson;
