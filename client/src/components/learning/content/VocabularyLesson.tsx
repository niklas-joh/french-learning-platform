import React from 'react';
import { ClientLesson } from '../../../types/LearningPath';
import LessonContentContainer from './LessonContentContainer';

const VocabularyLesson: React.FC<{ lesson: ClientLesson }> = ({ lesson }) => {
  return (
    <LessonContentContainer title="Vocabulary">
      <pre>{JSON.stringify(lesson.contentData, null, 2)}</pre>
    </LessonContentContainer>
  );
};

export default VocabularyLesson;
