import { z } from 'zod';

/**
 * Enum for different response types that determine assessment strategy.
 */
export const ResponseTypeSchema = z.enum([
  'multiple-choice',
  'open-ended',
  'fill-in-the-blank',
  'pronunciation',
  'grammar-check',
  'translation'
]);

export type ResponseType = z.infer<typeof ResponseTypeSchema>;

/**
 * Schema for assessment request data.
 */
export const AssessmentRequestSchema = z.object({
  userContentCompletionId: z.number().int().positive(),
  responseType: ResponseTypeSchema,
  userResponse: z.any().describe("The user's answer, can be string, object, etc."),
  expectedAnswer: z.string().optional().describe("Expected answer for comparison (e.g., multiple choice)"),
  context: z.object({
    lessonContent: z.string().optional(),
    exerciseInstructions: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  }).optional(),
});

/**
 * Schema for the feedback object, ensuring a consistent structure from the AI.
 */
export const PersonalizedFeedbackSchema = z.object({
  message: z.string().describe("The main feedback message for the user."),
  tone: z.enum(['congratulatory', 'encouraging', 'motivational', 'neutral']),
  suggestions: z.array(z.string()).describe("Specific suggestions for improvement."),
  motivationalQuote: z.string().optional(),
  grammarTip: z.string().optional(),
  culturalNote: z.string().optional(),
});

/**
 * Schema for a single assessment result component.
 */
export const AssessmentResultSchema = z.object({
  score: z.number().min(0).max(100).describe("The calculated score for the response."),
  isCorrect: z.boolean(),
  feedback: PersonalizedFeedbackSchema,
  confidence: z.enum(['low', 'medium', 'high']).describe("The AI's confidence in its assessment."),
  assessmentType: z.string().describe("e.g., 'multiple-choice', 'fill-in-the-blank', 'pronunciation'"),
  isFallback: z.boolean().optional().describe("True if a fallback mechanism was used for grading."),
});

/**
 * Schema for the overall result of a grading operation, which might contain multiple assessments.
 */
export const GradingResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  feedbackSummary: z.string(),
  results: z.array(AssessmentResultSchema),
  userContentCompletionId: z.number().int().positive(),
});

/**
 * Schema for the request body of the /grade endpoint.
 */
export const GradeAssessmentRequestSchema = z.object({
  userContentCompletionId: z.number().int().positive().describe("ID linking to the user's completed content."),
  userResponse: z.any().describe("The user's answer, can be string, object, etc. depending on the exercise."),
});

// Infer TypeScript types from Zod schemas
export type AssessmentRequest = z.infer<typeof AssessmentRequestSchema>;
export type PersonalizedFeedback = z.infer<typeof PersonalizedFeedbackSchema>;
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;
export type GradingResult = z.infer<typeof GradingResultSchema>;
export type GradeAssessmentRequest = z.infer<typeof GradeAssessmentRequestSchema>;
