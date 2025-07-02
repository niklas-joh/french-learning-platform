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

// TODO: Add Zod schemas for other content types (Lesson, Exercise, etc.) as they are implemented.
// For example:
// export const AILessonSchema = z.object({ ... });
