import { z } from 'zod';
import { IContentStructurer } from './IContentStructurer.js';
import { IStructuredLesson, LessonSection, VocabularyItem } from '../../types/Content.js';
import { AILessonSchema } from '../../types/ai-schemas.js';

export class LessonStructurer implements IContentStructurer<IStructuredLesson> {
  public async structure(rawContent: string): Promise<IStructuredLesson> {
    let jsonData: unknown;
    try {
      jsonData = JSON.parse(rawContent);
    } catch (error) {
      // More granular error for debugging
      throw new Error(`Invalid JSON format received from AI. Error: ${(error as Error).message}`);
    }

    const validationResult = AILessonSchema.safeParse(jsonData);

    if (!validationResult.success) {
      // Zod provides detailed errors, which are invaluable for debugging prompts.
      console.error("AI content validation failed for Lesson:", validationResult.error.flatten());
      throw new Error(`AI content validation failed: ${validationResult.error.message}`);
    }

    // Transform the validated data into our application's domain model.
    const sections: LessonSection[] = validationResult.data.sections.map(section => ({
      type: section.type,
      title: section.title,
      content: section.content,
      duration: section.duration,
    }));

    // Transform vocabulary items if provided
    const vocabulary: VocabularyItem[] = validationResult.data.vocabulary?.map(item => ({
      word: item.word,
      definition: item.definition,
      pronunciation: '', // AI doesn't provide this, default to empty
      ipa: '', // AI doesn't provide this, default to empty
      examples: item.examples,
      difficulty: 'medium' as const, // Defaulting difficulty
    })) || [];

    // Construct the full IStructuredLesson object
    return {
      type: 'lesson',
      title: validationResult.data.title,
      description: validationResult.data.description,
      sections: sections,
      learningObjectives: validationResult.data.learningObjectives,
      estimatedTime: validationResult.data.estimatedTime,
      vocabulary: vocabulary,
    };
  }
}
