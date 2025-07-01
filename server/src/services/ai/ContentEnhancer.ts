/**
 * AI Content Enhancement Service
 * 
 * Enhances AI-generated content by adding metadata, personalization,
 * cultural context, and adaptive elements to improve learning outcomes.
 * 
 * Key Features:
 * - Personalization based on user learning context
 * - Cultural context and regional adaptations
 * - Difficulty adjustment and adaptive content
 * - Metadata enrichment for better content management
 * - Audio and visual enhancement suggestions
 * - Learning objective optimization
 */

import { IContentEnhancer } from '../contentGeneration/interfaces';
import { 
  StructuredContent, 
  LearningContext, 
  ContentType,
  VocabularyItem,
  Exercise,
  isLesson,
  isVocabularyDrill,
  isGrammarExercise,
  isCulturalContent,
  isPersonalizedExercise
} from '../../types/Content';

interface EnhancementRule {
  name: string;
  priority: number; // Higher priority runs first
  enhance: (content: StructuredContent, context: LearningContext) => Promise<StructuredContent>;
}

export class ContentEnhancer implements IContentEnhancer {
  private readonly enhancementRules: EnhancementRule[];

  constructor() {
    this.enhancementRules = this.initializeEnhancementRules();
  }

  /**
   * Main enhancement method that applies all enhancement rules in order of priority
   */
  async enhance(content: StructuredContent, context: LearningContext): Promise<StructuredContent> {
    let enhancedContent = { ...content };

    try {
      // Sort rules by priority (descending)
      const sortedRules = this.enhancementRules.sort((a, b) => b.priority - a.priority);

      for (const rule of sortedRules) {
        enhancedContent = await rule.enhance(enhancedContent, context);
      }

      return enhancedContent;
    } catch (error) {
      console.error('Error during content enhancement:', error);
      // Return original content if enhancement fails
      return content;
    }
  }

  /**
   * Initialize all enhancement rules
   */
  private initializeEnhancementRules(): EnhancementRule[] {
    return [
      {
        name: 'personalize_vocabulary',
        priority: 10,
        enhance: async (content, context) => {
          if (isLesson(content) || isVocabularyDrill(content)) {
            content.vocabulary = this.personalizeVocabulary(content.vocabulary, context);
          }
          return content;
        }
      },
      {
        name: 'adapt_exercise_difficulty',
        priority: 9,
        enhance: async (content, context) => {
          if (isGrammarExercise(content) || isPersonalizedExercise(content)) {
            content.exercises = this.adaptExerciseDifficulty(content.exercises, context);
          }
          return content;
        }
      },
      {
        name: 'add_cultural_notes',
        priority: 8,
        enhance: async (content, context) => {
          if (isLesson(content) || isCulturalContent(content)) {
            content = this.addCulturalNotes(content, context);
          }
          return content;
        }
      },
      {
        name: 'optimize_learning_objectives',
        priority: 7,
        enhance: async (content, context) => {
          content.learningObjectives = this.optimizeLearningObjectives(content.learningObjectives);
          return content;
        }
      },
      {
        name: 'add_multimedia_suggestions',
        priority: 6,
        enhance: async (content, context) => {
          if (isLesson(content)) {
            content.sections.forEach(section => {
              section.content = this.addMultimediaSuggestions(section.content);
            });
          }
          return content;
        }
      }
    ];
  }

  /**
   * Helper methods for enhancement rules
   */

  private personalizeVocabulary(vocabulary: VocabularyItem[], context: LearningContext): VocabularyItem[] {
    return vocabulary.map(item => {
      // Add examples related to user interests
      if (context.interests && context.interests.length > 0) {
        const interest = context.interests[0]; // Use first interest for simplicity
        item.examples.push(`Example related to ${interest}: ...`);
      }

      // Adjust difficulty based on user's weak areas
      if (context.weakAreas && context.weakAreas.includes('vocabulary')) {
        item.difficulty = 'easy'; // Simplify if vocabulary is a weak area
      }

      return item;
    });
  }

  private adaptExerciseDifficulty(exercises: Exercise[], context: LearningContext): Exercise[] {
    return exercises.map(exercise => {
      if (context.strengths && context.strengths.includes('grammar')) {
        exercise.difficulty = 'hard'; // Increase difficulty if grammar is a strength
      } else if (context.weakAreas && context.weakAreas.includes('grammar')) {
        exercise.difficulty = 'easy'; // Decrease difficulty if grammar is a weak area
      }
      return exercise;
    });
  }

  private addCulturalNotes(content: StructuredContent, context: LearningContext): StructuredContent {
    if (isLesson(content)) {
      if (!content.culturalNotes) {
        content.culturalNotes = [];
      }
      content.culturalNotes.push({
        title: 'Cultural Insight',
        content: `Note for ${context.currentLevel} learners: ...`,
        relevance: 'Adds depth to the lesson topic'
      });
    }
    return content;
  }

  private optimizeLearningObjectives(objectives: string[]): string[] {
    // Make objectives more action-oriented
    return objectives.map(obj => {
      if (obj.toLowerCase().startsWith('understand')) {
        return obj.replace(/understand/i, 'explain');
      }
      if (obj.toLowerCase().startsWith('know')) {
        return obj.replace(/know/i, 'identify and use');
      }
      return obj;
    });
  }

  private addMultimediaSuggestions(text: string): string {
    // Add placeholders for multimedia content
    if (text.includes('Eiffel Tower')) {
      return text.replace('Eiffel Tower', 'Eiffel Tower [Image suggestion: Photo of Eiffel Tower]');
    }
    if (text.includes('French song')) {
      return text.replace('French song', 'French song [Audio suggestion: Embed popular French song]');
    }
    return text;
  }
}
