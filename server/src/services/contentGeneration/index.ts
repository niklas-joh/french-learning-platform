// Barrel exports for Dynamic Content Generation module
// Provides clean imports for all content generation components

// Main service class
export { DynamicContentGenerator } from './DynamicContentGenerator';

// Interface definitions
export type {
  IContentGenerator,
  IContentValidator,
  IContentEnhancer,
  IContentTemplateManager,
  IContentValidatorFactory,
  IContentEnhancerFactory,
  IContentCache,
  ILearningContextService,
  IContentGenerationJobQueue,
  IContentFallbackHandler,
  IContentGenerationMetrics,
  JobStatus
} from './interfaces';

// Re-export types from Content.ts for convenience
export type {
  ContentRequest,
  ContentGenerationOptions,
  GeneratedContent,
  ContentMetadata,
  ContentValidation,
  ContentTemplate,
  LearningContext,
  ContentType,
  StructuredContent,
  BaseStructuredContent,
  IStructuredLesson,
  IStructuredVocabularyDrill,
  IStructuredGrammarExercise,
  IStructuredCulturalContent,
  IStructuredPersonalizedExercise,
  Exercise,
  ExerciseType,
  ExerciseItem,
  MultipleChoiceItem,
  FillInBlankItem,
  MatchingItem,
  OrderingItem,
  TrueFalseItem,
  DragDropItem,
  ListeningComprehensionItem,
  PronunciationPracticeItem
} from '../../types/Content';

// Utility functions
export { 
  generateContentId,
  isLesson,
  isVocabularyDrill,
  isGrammarExercise,
  isCulturalContent,
  isPersonalizedExercise
} from '../../types/Content';
