import React, { Suspense, useMemo } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { ClientLesson } from '../../../types/LearningPath';
import { LessonType, validateLessonContent } from '../../../types/LessonContentTypes';
import { lessonComponentMap } from './index';

interface DynamicLessonContentProps {
  lesson: ClientLesson;
}

/**
 * A component that dynamically renders lesson content based on the lesson type.
 * This component handles:
 * - Content data validation using Zod schemas
 * - Dynamic component loading with lazy loading
 * - Error handling for invalid content or unsupported lesson types
 * - Loading states with Suspense fallback
 */
const DynamicLessonContent: React.FC<DynamicLessonContentProps> = ({ lesson }) => {
  // Validate and parse the lesson content data
  const contentValidation = useMemo(() => {
    if (!lesson.contentData) {
      return {
        success: false,
        error: 'No content data provided for this lesson',
      };
    }

    try {
      // Parse JSON if contentData is a string
      const parsedContent = typeof lesson.contentData === 'string' 
        ? JSON.parse(lesson.contentData) 
        : lesson.contentData;

      // Validate against the appropriate schema
      return validateLessonContent(lesson.type as LessonType, parsedContent);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse lesson content data. The content may be malformed.',
      };
    }
  }, [lesson.contentData, lesson.type]);

  // Get the appropriate lesson component
  const LessonComponent = useMemo(() => {
    return lessonComponentMap[lesson.type as LessonType];
  }, [lesson.type]);

  // Handle validation errors
  if (!contentValidation.success) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <strong>Content Error:</strong> {contentValidation.error}
      </Alert>
    );
  }

  // Handle unsupported lesson types
  if (!LessonComponent) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        <strong>Unsupported Lesson Type:</strong> The lesson type "{lesson.type}" is not yet supported. 
        Please contact support if you continue to see this message.
      </Alert>
    );
  }

  // Render the appropriate lesson component with validated content
  return (
    <Suspense
      fallback={
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px' 
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <LessonComponent content={contentValidation.data} />
    </Suspense>
  );
};

export default DynamicLessonContent;
