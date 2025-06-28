import React from 'react';
import { ClientLesson } from '../../../types/LearningPath';
import LessonContentContainer from './LessonContentContainer';

const ConversationLesson: React.FC<{ lesson: ClientLesson }> = ({ lesson }) => {
  return (
    <LessonContentContainer title="Conversation">
      <pre>{JSON.stringify(lesson.contentData, null, 2)}</pre>
    </LessonContentContainer>
  );
};

export default ConversationLesson;
