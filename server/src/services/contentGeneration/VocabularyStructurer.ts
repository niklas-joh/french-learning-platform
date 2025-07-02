import { z } from 'zod';
import { IContentStructurer } from './IContentStructurer';
import { IStructuredVocabularyDrill, VocabularyItem } from '../../types/Content';
import { AIVocabularyListSchema } from '../../types/ai-schemas';

export class VocabularyStructurer implements IContentStructurer<IStructuredVocabularyDrill> {
  public async structure(rawContent: string): Promise<IStructuredVocabularyDrill> {
    let jsonData: unknown;
    try {
      jsonData = JSON.parse(rawContent);
    } catch (error) {
      // More granular error for debugging
      throw new Error(`Invalid JSON format received from AI. Error: ${(error as Error).message}`);
    }

    const validationResult = AIVocabularyListSchema.safeParse(jsonData);

    if (!validationResult.success) {
      // Zod provides detailed errors, which are invaluable for debugging prompts.
      console.error("AI content validation failed for Vocabulary:", validationResult.error.flatten());
      throw new Error(`AI content validation failed: ${validationResult.error.message}`);
    }

    // Transform the validated data into our application's domain model.
    const vocabularyItems: VocabularyItem[] = validationResult.data.map(item => ({
      word: item.word,
      definition: item.translation, // Mapping translation to definition
      pronunciation: '', // AI doesn't provide this, default to empty
      ipa: '', // AI doesn't provide this, default to empty
      examples: [item.example.french], // Using the french example
      difficulty: 'medium', // Defaulting difficulty
    }));

    // Construct the full IStructuredVocabularyDrill object
    return {
        type: 'vocabulary_drill',
        title: 'Vocabulary Drill', // Can be enhanced later
        description: 'Practice the following vocabulary words.',
        learningObjectives: ['Memorize new vocabulary', 'Understand words in context'],
        estimatedTime: 10,
        context: 'General vocabulary practice.',
        vocabulary: vocabularyItems,
        exercises: [], // Exercises can be generated in a separate step
        culturalContext: 'This vocabulary is common in everyday French conversation.'
    };
  }
}
