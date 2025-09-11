import api from './api';
import { Topic } from '../types/Topic';
import { ClientLesson } from '../types/LearningPath';

// Note: This service is being refactored to use the central 'api' instance.
// The routes are now pointing to the /admin namespace as per the backend routing structure.

/**
 * Interactive capabilities interface for lesson types
 * Defines what interactive features each lesson type supports
 */
export interface InteractiveCapabilities {
  hasFlashcards: boolean;
  hasQuiz: boolean;
  hasPronunciation: boolean;
  hasRolePlay: boolean;
  hasListening: boolean;
  hasFillInBlanks: boolean;
}

/**
 * Content validation result interface
 */
export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const fetchSampleQuiz = async () => {
  // Assuming this is a public, non-admin route. If it's admin, it needs /admin prefix.
  // This route does not seem to exist in the new structure, commenting out.
  // const response = await api.get('/content/sample-quiz');
  // return response.data;
  console.warn('fetchSampleQuiz is deprecated and does not exist in v1 API.');
  return Promise.resolve(null);
};

export const getTopics = async (): Promise<Topic[]> => {
  // The central api instance handles the token automatically.
  const response = await api.get<Topic[]>('/admin/topics');
  return response.data;
};

export const getTopicById = async (topicId: string): Promise<Topic> => {
  const response = await api.get<Topic>(`/admin/topics/${topicId}`);
  return response.data;
};

export const getContentForTopic = async (topicId: number | string) => {
  // This specific route /admin/topics/:id/content does not exist.
  // The correct way is likely to get all content and filter by topicId on the client,
  // or to add a query param to the /admin/content route.
  // For now, marking as deprecated.
  console.warn('getContentForTopic is deprecated. Use getContentItems and filter by topicId.');
  // As a fallback, this might be the intended route:
  const response = await api.get(`/admin/content?topicId=${topicId}`);
  return response.data;
};

export const getContentById = async (id: number | string) => {
  const response = await api.get(`/admin/content/${id}`);
  return response.data;
};

export const getAssignedContent = async () => {
  // This is a user-specific route, not a content route.
  // It should ideally be in userService.ts, but we'll fix the URL here for now.
  const response = await api.get('/users/me/assignments');
  return response.data;
};

/**
 * Validates lesson content to ensure consistency and completeness
 * 
 * This function validates lesson content against the standardized formats
 * established by the database migration. It ensures all required fields
 * are present and properly formatted for each lesson type.
 * 
 * @param lesson - The lesson object to validate
 * @returns ContentValidationResult with validation status and any errors/warnings
 * 
 * @example
 * ```typescript
 * const result = validateLessonContent(lesson);
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export const validateLessonContent = (lesson: ClientLesson): ContentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic lesson validation
  if (!lesson.id) errors.push('Lesson ID is required');
  if (!lesson.title) errors.push('Lesson title is required');
  if (!lesson.type) errors.push('Lesson type is required');

  // Parse content data if it's a string
  let contentData;
  try {
    contentData = typeof lesson.contentData === 'string' 
      ? JSON.parse(lesson.contentData) 
      : lesson.contentData;
  } catch (error) {
    errors.push('Invalid JSON in contentData');
    return { isValid: false, errors, warnings };
  }

  // Type-specific validation
  switch (lesson.type) {
    case 'vocabulary':
      validateVocabularyContent(contentData, errors, warnings);
      break;
    case 'conversation':
      validateConversationContent(contentData, errors, warnings);
      break;
    case 'grammar':
      validateGrammarContent(contentData, errors, warnings);
      break;
    case 'quiz':
    case 'practice':
      validateInteractiveContent(contentData, errors, warnings);
      break;
    default:
      warnings.push(`Unknown lesson type: ${lesson.type}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Gets interactive capabilities for a lesson type
 * 
 * Determines what interactive features should be available for each
 * lesson type based on the content structure and pedagogical best practices.
 * 
 * @param lessonType - The type of lesson (vocabulary, conversation, etc.)
 * @returns InteractiveCapabilities object defining available interactions
 * 
 * @example
 * ```typescript
 * const capabilities = getInteractiveCapabilities('vocabulary');
 * if (capabilities.hasFlashcards) {
 *   // Render flashcard component
 * }
 * ```
 */
export const getInteractiveCapabilities = (lessonType: string): InteractiveCapabilities => {
  const baseCapabilities: InteractiveCapabilities = {
    hasFlashcards: false,
    hasQuiz: false,
    hasPronunciation: false,
    hasRolePlay: false,
    hasListening: false,
    hasFillInBlanks: false,
  };

  switch (lessonType) {
    case 'vocabulary':
      return {
        ...baseCapabilities,
        hasFlashcards: true,
        hasQuiz: true,
        hasPronunciation: true,
      };

    case 'conversation':
      return {
        ...baseCapabilities,
        hasRolePlay: true,
        hasListening: true,
        hasPronunciation: true,
      };

    case 'grammar':
      return {
        ...baseCapabilities,
        hasQuiz: true,
        hasFillInBlanks: true,
      };

    case 'quiz':
    case 'practice':
      return {
        ...baseCapabilities,
        hasQuiz: true,
      };

    default:
      return baseCapabilities;
  }
};

/**
 * Validates vocabulary lesson content structure
 * @private
 */
function validateVocabularyContent(contentData: any, errors: string[], warnings: string[]): void {
  if (!contentData.vocabulary || !Array.isArray(contentData.vocabulary)) {
    errors.push('Vocabulary lessons must have a "vocabulary" array');
    return;
  }

  if (contentData.vocabulary.length === 0) {
    warnings.push('Vocabulary array is empty');
  }

  contentData.vocabulary.forEach((item: any, index: number) => {
    if (!item.word) errors.push(`Vocabulary item ${index + 1} missing "word" field`);
    if (!item.definition) errors.push(`Vocabulary item ${index + 1} missing "definition" field`);
    if (!Array.isArray(item.examples)) {
      warnings.push(`Vocabulary item ${index + 1} should have "examples" as an array`);
    }
  });
}

/**
 * Validates conversation lesson content structure
 * @private
 */
function validateConversationContent(contentData: any, errors: string[], warnings: string[]): void {
  if (!contentData.dialogue || !Array.isArray(contentData.dialogue)) {
    errors.push('Conversation lessons must have a "dialogue" array');
    return;
  }

  if (contentData.dialogue.length === 0) {
    warnings.push('Dialogue array is empty');
  }

  contentData.dialogue.forEach((line: any, index: number) => {
    if (!line.speaker) errors.push(`Dialogue line ${index + 1} missing "speaker" field`);
    if (!line.line) errors.push(`Dialogue line ${index + 1} missing "line" field`);
  });

  if (contentData.keyPhrases && !Array.isArray(contentData.keyPhrases)) {
    warnings.push('keyPhrases should be an array if present');
  }
}

/**
 * Validates grammar lesson content structure
 * @private
 */
function validateGrammarContent(contentData: any, errors: string[], warnings: string[]): void {
  if (!contentData.rule) warnings.push('Grammar lessons should have a "rule" field');
  if (!contentData.explanation) warnings.push('Grammar lessons should have an "explanation" field');
  if (!Array.isArray(contentData.examples)) {
    warnings.push('Grammar lessons should have "examples" as an array');
  }
}

/**
 * Validates interactive (quiz/practice) lesson content structure
 * @private
 */
function validateInteractiveContent(contentData: any, errors: string[], warnings: string[]): void {
  if (!contentData.question) errors.push('Interactive lessons must have a "question" field');
  if (!contentData.answer) warnings.push('Interactive lessons should have an "answer" field');
  
  if (!contentData.feedback || typeof contentData.feedback !== 'object') {
    errors.push('Interactive lessons must have a "feedback" object');
  } else {
    if (!contentData.feedback.correct) {
      warnings.push('Feedback should include "correct" message');
    }
    if (!contentData.feedback.incorrect) {
      warnings.push('Feedback should include "incorrect" message');
    }
  }

  if (contentData.options && !Array.isArray(contentData.options)) {
    warnings.push('Options should be an array if present');
  }
}

// Exporting the default apiClient is no longer necessary as we use the named exports
// and the central 'api' instance.
// export default apiClient;
