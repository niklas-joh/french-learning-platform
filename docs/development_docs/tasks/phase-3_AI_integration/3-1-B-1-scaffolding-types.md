# Task 3.1.B.1: Initial Scaffolding & Type Definition

## **Task Information**
- **Task ID**: 3.1.B.1
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 1 hour
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.A (AI Orchestration Service)
- **Status**: ⏳ Not Started

## **Objective**
Set up the foundational TypeScript types, interfaces, and basic service structure for the Dynamic Content Generation system. This includes creating the core content types that will be used throughout the AI content generation pipeline.

## **Success Criteria**
- [ ] Content-specific TypeScript interfaces defined
- [ ] Service scaffolding created with proper dependency injection
- [ ] Type safety established for all content generation workflows
- [ ] Integration points with existing AI Orchestrator defined
- [ ] Basic service factory pattern implemented

## **Implementation Details**

### **1. Core Content Types**

Create comprehensive TypeScript types that follow existing codebase patterns and leverage database models.

```typescript
// server/src/types/Content.ts

export interface ContentRequest {
  userId: number;
  type: ContentType;
  level?: string;
  topics?: string[];
  duration?: number; // in minutes
  focusAreas?: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  includeExercises?: boolean;
  includeCulturalContext?: boolean;
  includeAudio?: boolean;
  includeExamples?: boolean;
  vocabulary?: string[];
  context?: string;
  grammarFocus?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'adaptive';
  exerciseCount?: number;
  culturalTopic?: string;
  adaptToWeaknesses?: boolean;
  reinforcePreviousLearning?: boolean;
  includeMoreExamples?: boolean;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  content: StructuredContent;
  metadata: ContentMetadata;
  validation: ContentValidation;
  estimatedCompletionTime: number;
  learningObjectives: string[];
}

export interface ContentMetadata {
  userId: number;
  generatedAt: Date;
  level: string;
  topics: string[];
  aiGenerated: boolean;
  version: string;
  fallback?: boolean;
  generationTime?: number; // milliseconds
  tokenUsage?: number;
  modelUsed?: string;
}

export interface ContentValidation {
  isValid: boolean;
  score: number; // 0-1
  issues: string[];
  suggestions?: string[];
  confidence?: number;
}

export interface ContentTemplate {
  structure: Record<string, string>;
  requirements: Record<string, any>;
  adaptations?: Record<string, string>;
  prompts?: Record<string, string>;
}

export interface LearningContext {
  userId: number;
  currentLevel: string;
  learningStyle: string;
  weakAreas: string[];
  strengths: string[];
  interests: string[];
  recentTopics: string[];
  performanceHistory: any[];
  lastActivity?: Date;
  streakDays?: number;
  totalLessons?: number;
}

export type ContentType = 
  | 'lesson'
  | 'vocabulary_drill'
  | 'grammar_exercise'
  | 'cultural_content'
  | 'personalized_exercise'
  | 'pronunciation_drill'
  | 'conversation_practice';

// Discriminated union for type-safe content structures
export type StructuredContent = 
  | IStructuredLesson
  | IStructuredVocabularyDrill
  | IStructuredGrammarExercise
  | IStructuredCulturalContent
  | IStructuredPersonalizedExercise;

export interface IStructuredLesson {
  type: 'lesson';
  title: string;
  description: string;
  learningObjectives: string[];
  estimatedTime: number;
  sections: LessonSection[];
  vocabulary: VocabularyItem[];
  grammar?: GrammarConcept;
  culturalNotes?: CulturalNote[];
}

export interface IStructuredVocabularyDrill {
  type: 'vocabulary_drill';
  title: string;
  description: string;
  context: string;
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
  culturalContext?: string;
}

export interface IStructuredGrammarExercise {
  type: 'grammar_exercise';
  title: string;
  grammarRule: string;
  explanation: string;
  examples: string[];
  exercises: Exercise[];
  tips: string[];
  commonMistakes: string[];
}

export interface IStructuredCulturalContent {
  type: 'cultural_content';
  title: string;
  topic: string;
  description: string;
  keyPoints: string[];
  vocabulary: VocabularyItem[];
  discussionQuestions: string[];
  multimedia?: MultimediaItem[];
  connections: string[];
}

export interface IStructuredPersonalizedExercise {
  type: 'personalized_exercise';
  title: string;
  description: string;
  focusAreas: string[];
  exercises: Exercise[];
  adaptiveElements: AdaptiveElement[];
}

// Supporting interfaces
export interface LessonSection {
  type: 'introduction' | 'presentation' | 'practice' | 'wrap_up';
  title: string;
  content: string;
  duration: number;
  vocabulary?: VocabularyItem[];
  grammar?: GrammarConcept;
  exercises?: Exercise[];
}

export interface VocabularyItem {
  word: string;
  definition: string;
  pronunciation: string;
  ipa?: string;
  examples: string[];
  image?: string;
  audio?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  culturalContext?: string;
  regionalVariations?: string[];
}

export interface GrammarConcept {
  rule: string;
  explanation: string;
  examples: string[];
  exceptions?: string[];
}

export interface Exercise {
  type: string;
  instruction: string;
  items: any[];
  feedback: string;
  difficulty?: string;
  estimatedTime?: number;
}

export interface CulturalNote {
  title: string;
  content: string;
  relevance: string;
}

export interface MultimediaItem {
  type: 'image' | 'audio' | 'video';
  url: string;
  description: string;
  alt?: string;
}

export interface AdaptiveElement {
  condition: string;
  content: any;
  trigger: string;
}
```

### **2. Service Interface Definitions**

Create interfaces that follow the Strategy Pattern for better extensibility.

```typescript
// server/src/services/contentGeneration/interfaces.ts

import { ContentRequest, GeneratedContent, ContentValidation, LearningContext, ContentTemplate, ContentType } from '../../types/Content';

export interface IContentGenerator {
  generateContent(request: ContentRequest, retryCount?: number): Promise<GeneratedContent>;
  generateLesson(userId: number, topic: string, level: string, options?: any): Promise<GeneratedContent>;
  generateVocabularyDrill(userId: number, vocabularySet: string[], context: string): Promise<GeneratedContent>;
  generateGrammarExercise(userId: number, grammarRule: string, difficulty: string): Promise<GeneratedContent>;
}

export interface IContentValidator {
  validate(content: any, request: ContentRequest): Promise<ContentValidation>;
}

export interface IContentEnhancer {
  enhance(content: any, context: LearningContext): Promise<any>;
}

export interface IContentTemplateManager {
  getTemplate(type: ContentType, context: LearningContext): ContentTemplate;
}

export interface IContentValidatorFactory {
  getValidator(type: ContentType): IContentValidator;
}

export interface IContentEnhancerFactory {
  getEnhancer(type: ContentType): IContentEnhancer;
}
```

### **3. Basic Service Structure**

Create the main service class with proper dependency injection.

```typescript
// server/src/services/contentGeneration/DynamicContentGenerator.ts

import { AIOrchestrator } from '../ai/aiOrchestrator';
import { PromptTemplateEngine } from '../ai/promptTemplateEngine';
import { 
  IContentGenerator,
  IContentValidatorFactory,
  IContentEnhancerFactory,
  IContentTemplateManager
} from './interfaces';
import { 
  ContentRequest, 
  GeneratedContent, 
  LearningContext,
  ContentType 
} from '../../types/Content';

export class DynamicContentGenerator implements IContentGenerator {
  private static readonly MAX_RETRIES = 2;

  constructor(
    private aiOrchestrator: AIOrchestrator,
    private promptEngine: PromptTemplateEngine,
    private validatorFactory: IContentValidatorFactory,
    private enhancerFactory: IContentEnhancerFactory,
    private templateManager: IContentTemplateManager
  ) {}

  async generateContent(request: ContentRequest, retryCount = 0): Promise<GeneratedContent> {
    // TODO: Refactor to async workflow (See Future Implementation #30)
    // Initial request should return 202 Accepted and trigger background job
    
    try {
      const learningContext = await this.getLearningContext(request.userId);
      const template = this.templateManager.getTemplate(request.type, learningContext);
      
      // TODO: Implement runtime validation with Zod (See Future Implementation #21)
      const rawContent = await this.generateRawContent(request, template, learningContext);
      
      const validator = this.validatorFactory.getValidator(request.type);
      const validation = await validator.validate(rawContent, request);
      
      if (!validation.isValid) {
        if (retryCount < DynamicContentGenerator.MAX_RETRIES) {
          const adjustedRequest = this.adjustRequestFromValidation(request, validation);
          return this.generateContent(adjustedRequest, retryCount + 1);
        }
        // TODO: Implement structured logging (See Future Implementation #24)
        console.warn(`Content generation failed validation after ${retryCount} retries.`, { request, validation });
      }

      const enhancer = this.enhancerFactory.getEnhancer(request.type);
      const enhancedContent = await enhancer.enhance(rawContent, learningContext);
      
      const finalContent = await this.structureContent(enhancedContent, request);
      
      return {
        id: this.generateContentId(),
        type: request.type,
        content: finalContent,
        metadata: {
          userId: request.userId,
          generatedAt: new Date(),
          level: learningContext.currentLevel,
          topics: request.topics || [],
          aiGenerated: true,
          version: '1.0',
        },
        validation,
        estimatedCompletionTime: this.estimateCompletionTime(finalContent),
        learningObjectives: this.extractLearningObjectives(finalContent),
      };
    } catch (error) {
      // TODO: Implement structured logging (See Future Implementation #24)
      console.error('Error generating content:', error);
      return this.getFallbackContent(request);
    }
  }

  // Placeholder methods to be implemented in subsequent subtasks
  async generateLesson(userId: number, topic: string, level: string, options: any = {}): Promise<GeneratedContent> {
    // Implementation in 3.1.B.3
    throw new Error('Not implemented yet');
  }

  async generateVocabularyDrill(userId: number, vocabularySet: string[], context: string): Promise<GeneratedContent> {
    // Implementation in 3.1.B.3
    throw new Error('Not implemented yet');
  }

  async generateGrammarExercise(userId: number, grammarRule: string, difficulty: string): Promise<GeneratedContent> {
    // Implementation in 3.1.B.3
    throw new Error('Not implemented yet');
  }

  // Private helper methods
  private async getLearningContext(userId: number): Promise<LearningContext> {
    // TODO: Implement optimized context loading (See Future Implementation #18)
    return {
      userId,
      currentLevel: 'A2',
      learningStyle: 'visual',
      weakAreas: ['pronunciation', 'verb_conjugation'],
      strengths: ['vocabulary', 'reading'],
      interests: ['travel', 'cuisine'],
      recentTopics: ['family', 'hobbies'],
      performanceHistory: [],
    };
  }

  private generateContentId(): string {
    return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private estimateCompletionTime(content: any): number {
    // Basic estimation - to be refined
    return 15;
  }

  private extractLearningObjectives(content: any): string[] {
    return content.learningObjectives || ['Practice French language skills'];
  }

  private async generateRawContent(request: ContentRequest, template: any, context: LearningContext): Promise<any> {
    // Implementation in 3.1.B.3
    throw new Error('Not implemented yet');
  }

  private adjustRequestFromValidation(request: ContentRequest, validation: any): ContentRequest {
    // Implementation in 3.1.B.3
    return request;
  }

  private async structureContent(content: any, request: ContentRequest): Promise<any> {
    // Implementation in 3.1.B.3
    return content;
  }

  private getFallbackContent(request: ContentRequest): GeneratedContent {
    // Implementation in 3.1.B.3
    throw new Error('Not implemented yet');
  }
}
```

## **Files to Create**
```
server/src/types/Content.ts
server/src/services/contentGeneration/interfaces.ts
server/src/services/contentGeneration/DynamicContentGenerator.ts
server/src/services/contentGeneration/index.ts (barrel exports)
```

## **Dependencies**
- Task 3.1.A (AI Orchestration Service) - Required for AIOrchestrator dependency
- Existing type patterns from the codebase
- Database models for User and Progress data

## **Review Points**
1. **Type Safety**: Ensure all interfaces are strongly typed and follow existing patterns
2. **Extensibility**: Verify the interface design supports future content types
3. **Dependencies**: Confirm proper dependency injection setup
4. **Integration**: Validate compatibility with AI Orchestrator

## **Possible Issues & Solutions**
1. **Issue**: Type complexity might be overwhelming
   - **Solution**: Use discriminated unions and keep interfaces focused
2. **Issue**: Too many dependencies in constructor
   - **Solution**: Consider factory pattern or DI container (Future Implementation #23)
3. **Issue**: Interface might be too rigid
   - **Solution**: Use optional properties and generic types where appropriate

## **Testing Strategy**
- Unit tests for type validation
- Interface contract tests
- Mock implementations for all dependencies
- Integration tests with AI Orchestrator

## **Next Steps**
After completion, proceed to Task 3.1.B.2 (Database Schema for AI Content)
