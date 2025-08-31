import { z } from 'zod';

/**
 * Defines the expected structure of a single vocabulary item from the AI.
 * This schema is used to validate the raw AI output before transforming it
 * into our internal `VocabularyItem` domain model.
 */
export const AIVocabularyItemSchema = z.object({
  word: z.string().min(1, { message: "Vocabulary word cannot be empty." }),
  translation: z.string().min(1, { message: "Translation cannot be empty." }),
  example: z.object({
    french: z.string().min(1, { message: "French example sentence cannot be empty." }),
    english: z.string().min(1, { message: "English example sentence cannot be empty." }),
  }),
});

/**
 * Defines the expected structure for a list of vocabulary items.
 */
export const AIVocabularyListSchema = z.array(AIVocabularyItemSchema);

/**
 * Defines the expected structure for lesson sections from the AI.
 */
export const AILessonSectionSchema = z.object({
  type: z.enum(['introduction', 'presentation', 'practice', 'wrap_up']),
  title: z.string().min(1, { message: "Section title cannot be empty." }),
  content: z.string().min(1, { message: "Section content cannot be empty." }),
  duration: z.number().min(1, { message: "Section duration must be at least 1 minute." }),
});

/**
 * Defines the expected structure for vocabulary items from the AI in lesson context.
 */
export const AILessonVocabularySchema = z.object({
  word: z.string().min(1, { message: "Vocabulary word cannot be empty." }),
  definition: z.string().min(1, { message: "Definition cannot be empty." }),
  examples: z.array(z.string().min(1)).min(1, { message: "At least one example is required." }),
});

/**
 * Defines the expected structure of a complete lesson from the AI.
 * This schema is used to validate the raw AI output before transforming it
 * into our internal `IStructuredLesson` domain model.
 */
export const AILessonSchema = z.object({
  title: z.string().min(1, { message: "Lesson title cannot be empty." }),
  description: z.string().min(20, { message: "Lesson description must be at least 20 characters." }),
  sections: z.array(AILessonSectionSchema).min(1, { message: "Lesson must contain at least 1 section." }),
  learningObjectives: z.array(z.string().min(1)).min(1, { message: "At least one learning objective is required." }),
  estimatedTime: z.number().min(5, { message: "Estimated time must be at least 5 minutes." }),
  vocabulary: z.array(AILessonVocabularySchema).optional(),
});

// TODO: Add Zod schemas for other content types (Exercise, etc.) as they are implemented.
