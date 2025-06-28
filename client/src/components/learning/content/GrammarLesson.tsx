import React from 'react';
import { ClientLesson } from '../../../types/LearningPath';
import LessonContentContainer from './LessonContentContainer';

const GrammarLesson: React.FC<{ lesson: ClientLesson }> = ({ lesson }) => {
  return (
    <LessonContentContainer title="Grammar">
      <pre>{JSON.stringify(lesson.contentData, null, 2)}</pre>
    </LessonContentContainer>
  );
};

export default GrammarLesson;
