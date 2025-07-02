import { IStructuredLesson, VocabularyItem, Exercise, StructuredContent as AppStructuredContent } from '../../types/Content';

// Re-exporting the comprehensive StructuredContent type from the main types file.
export type StructuredContent = AppStructuredContent;

/**
 * Defines the contract for a class that can structure raw AI content
 * into a specific, type-safe domain model.
 */
export interface IContentStructurer<T extends StructuredContent> {
  /**
   * Parses, validates, and transforms a raw JSON string from the AI.
   * @param rawContent The raw JSON string.
   * @returns A promise that resolves to the structured, type-safe content.
   * @throws An error if parsing, validation, or transformation fails.
   */
  structure(rawContent: string): Promise<T>;
}
