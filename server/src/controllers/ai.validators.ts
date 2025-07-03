/**
 * AI Request Validation Schemas using Zod
 * 
 * Provides runtime validation for AI API requests to ensure data integrity
 * and security. These schemas correspond to the AI task payload types defined
 * in the centralized AI type system.
 * 
 * Key benefits:
 * - Runtime protection against malformed client requests
 * - Type-safe validation with automatic TypeScript inference
 * - Clear error messages for debugging and API responses
 * - Single source of truth alignment with AI.ts type definitions
 * 
 * TODO: Integrate with centralized schema validation strategy as per #21 in future_implementation_considerations.md
 */

import { z } from 'zod';

/**
 * Validation schema for lesson generation requests
 * Corresponds to AITaskPayloads['GENERATE_LESSON']['request']
 */
export const generateLessonPayloadSchema = z.object({
  type: z.literal('lesson'),
  topic: z.string()
    .min(1, 'Topic is required')
    .max(100, 'Topic must be less than 100 characters'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'adaptive'], {
    errorMap: () => ({ message: 'Difficulty must be beginner, intermediate, advanced, or adaptive' })
  }),
  estimatedTime: z.number()
    .int('Estimated time must be an integer')
    .min(5, 'Estimated time must be at least 5 minutes')
    .max(120, 'Estimated time must be less than 120 minutes')
    .optional(),
});

/**
 * Validation schema for pronunciation assessment requests
 * Corresponds to AITaskPayloads['ASSESS_PRONUNCIATION']['request']
 */
export const assessPronunciationPayloadSchema = z.object({
  audioUrl: z.string()
    .url('Audio URL must be a valid URL')
    .min(1, 'Audio URL is required'),
  expectedPhrase: z.string()
    .min(1, 'Expected phrase is required')
    .max(500, 'Expected phrase must be less than 500 characters'),
});

/**
 * Validation schema for response grading requests
 * Corresponds to AITaskPayloads['GRADE_RESPONSE']['request']
 */
export const gradeResponsePayloadSchema = z.object({
  userResponse: z.string()
    .min(1, 'User response is required')
    .max(1000, 'User response must be less than 1000 characters'),
  correctAnswer: z.string()
    .min(1, 'Correct answer is required')
  .max(1000, 'Correct answer must be less than 1000 characters'),
  questionType: z.enum(['multiple_choice', 'fill_blank', 'translation', 'essay'], {
    errorMap: () => ({ message: 'Question type must be multiple_choice, fill_blank, translation, or essay' })
  }),
});

/**
 * Validation schema for pagination query parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Future validation schemas for upcoming AI tasks
 * TODO: Implement these when the corresponding features are developed
 */

// TODO: Task 3.2.A - Add generateCurriculumPathPayloadSchema when Adaptive Curriculum Engine is implemented
// export const generateCurriculumPathPayloadSchema = z.object({
//   currentLevel: z.string().min(1, 'Current level is required'),
//   goals: z.array(z.string().min(1)).min(1, 'At least one goal is required'),
// });

// TODO: Task 3.2.B - Add conversationalTutorPayloadSchema when Conversational AI Tutor is implemented
// export const conversationalTutorPayloadSchema = z.object({
//   message: z.string().min(1, 'Message is required').max(500, 'Message too long'),
//   conversationHistory: z.array(z.any()).optional(),
// });

/**
 * Map of AI task types to their corresponding validation schemas
 * This provides a type-safe way to access validators based on task type
 */
export const validationSchemaMap = {
  GENERATE_LESSON: generateLessonPayloadSchema,
  ASSESS_PRONUNCIATION: assessPronunciationPayloadSchema,
  GRADE_RESPONSE: gradeResponsePayloadSchema,
  // TODO: Add future schemas as they are implemented
} as const;

/**
 * Type for extracting schema keys (for type safety)
 */
export type ValidatedAITask = keyof typeof validationSchemaMap;

/**
 * Utility function to validate a payload against its corresponding schema
 * 
 * @param taskType - The AI task type
 * @param payload - The payload to validate
 * @returns Validation result with parsed data or error details
 */
export function validateAIPayload<T extends ValidatedAITask>(
  taskType: T,
  payload: unknown
): {
  success: true;
  data: z.infer<typeof validationSchemaMap[T]>;
} | {
  success: false;
  error: z.ZodError;
} {
  const schema = validationSchemaMap[taskType];
  const result = schema.safeParse(payload);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Formats Zod validation errors for API responses
 * 
 * @param error - The Zod validation error
 * @returns User-friendly error message and details
 */
export function formatValidationError(error: z.ZodError): {
  message: string;
  details: Array<{
    field: string;
    message: string;
  }>;
} {
  const details = error.issues.map(issue => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));

  return {
    message: 'Request validation failed',
    details,
  };
}
