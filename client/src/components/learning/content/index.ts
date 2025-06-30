import React from 'react';
import { LessonType, LessonComponentProps } from '../../../types/LessonContentTypes';

// Lazy load the lesson components for better performance
const VocabularyLesson = React.lazy(() => import('./VocabularyLesson'));
const GrammarLesson = React.lazy(() => import('./GrammarLesson'));
const ConversationLesson = React.lazy(() => import('./ConversationLesson'));

/**
 * A map that associates lesson types with their corresponding React components.
 * This allows for dynamic rendering of lesson content based on the lesson's type.
 * Using React.lazy ensures that the component code is only loaded when it's needed.
 */
export const lessonComponentMap: Record<
  LessonType,
  React.LazyExoticComponent<React.FC<LessonComponentProps<any>>>
> = {
  [LessonType.Vocabulary]: VocabularyLesson,
  [LessonType.Grammar]: GrammarLesson,
  [LessonType.Conversation]: ConversationLesson,
  // Future lesson types can be added here
};
