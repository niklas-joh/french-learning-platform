import { IStructuredLesson, VocabularyItem, Exercise, StructuredContent as AppStructuredContent } from '../../types/Content';

// Re-exporting the comprehensive StructuredContent type from the main types file.
export type StructuredContent = AppStructuredContent;

/**
 * Defines the contract for content structuring services that transform raw AI-generated 
 * content into type-safe, validated domain models.
 * 
 * This interface supports flexible input handling to accommodate different AI content
 * generation patterns while ensuring consistent output structure and validation.
 * 
 * @template T - The target structured content type (extends StructuredContent)
 * 
 * @example
 * ```typescript
 * // Implementation example
 * class LessonStructurer implements IContentStructurer<IStructuredLesson> {
 *   async structure(content: string | object): Promise<IStructuredLesson> {
 *     // Handle both string and object inputs...
 *   }
 * }
 * 
 * // Usage example
 * const structurer = new LessonStructurer();
 * const lesson = await structurer.structure(aiGeneratedContent);
 * ```
 */
export interface IContentStructurer<T extends StructuredContent> {
  /**
   * Parses, validates, and transforms raw AI content into structured, type-safe domain models.
   * 
   * This method accepts both string (JSON format) and object inputs to provide flexible
   * compatibility with different AI content generation approaches:
   * - String input: Legacy format where AI returns JSON strings
   * - Object input: Modern format where AI returns structured objects
   * 
   * All implementations must:
   * 1. Handle both input types gracefully using type guards
   * 2. Perform comprehensive schema validation
   * 3. Transform data into application domain models
   * 4. Provide detailed error messages for debugging
   * 
   * @param {string | object} rawContent - Raw AI-generated content
   *   - String: JSON-formatted content requiring parsing
   *   - Object: Pre-structured content from AI orchestrators
   * 
   * @returns {Promise<T>} Promise resolving to validated, structured content
   * 
   * @throws {Error} When content parsing fails (invalid JSON or malformed object)
   * @throws {Error} When schema validation fails (content doesn't match expected structure)
   * @throws {Error} When transformation fails (mapping to domain model unsuccessful)
   * 
   * @example
   * ```typescript
   * // Handle string input (legacy AI format)
   * const jsonContent = '{"title": "French Lesson", "sections": [...]}';
   * const lesson = await structurer.structure(jsonContent);
   * 
   * // Handle object input (AIOrchestrator format)
   * const objectContent = {title: "French Lesson", sections: [...]};
   * const lesson = await structurer.structure(objectContent);
   * ```
   * 
   * @performance
   * Implementations should use schema caching and efficient type guards to minimize
   * processing overhead, especially for frequently called operations.
   */
  structure(rawContent: string | object): Promise<T>;
}
