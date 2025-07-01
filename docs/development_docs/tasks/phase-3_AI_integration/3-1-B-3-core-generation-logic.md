# Task 3.1.B.3: Implement Core Generation Logic

## **Task Information**
- **Task ID**: 3.1.B.3
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 2 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.2 (Database Schema for AI Content)
- **Status**: ⏳ Not Started

## **Objective**
Implement the core content generation logic including AI interaction, prompt engineering, content structuring, and fallback mechanisms. This includes completing the main generation workflow and implementing specific content type generators.

## **Success Criteria**
- [ ] Core generation workflow fully implemented
- [ ] AI interaction with prompt engineering completed
- [ ] Content structuring for all content types implemented
- [ ] Fallback content mechanisms working
- [ ] Retry logic with validation adjustments functional
- [ ] Performance optimizations in place
- [ ] Comprehensive error handling implemented

## **Implementation Details**

### **1. Complete DynamicContentGenerator Implementation**

Implement the remaining methods in the main generator service.

```typescript
// server/src/services/contentGeneration/DynamicContentGenerator.ts (continued from 3.1.B.1)

import { AIOrchestrator } from '../ai/aiOrchestrator';
import { PromptTemplateEngine } from '../ai/promptTemplateEngine';
import { AIGeneratedContent } from '../../models/AIGeneratedContent';
import { User } from '../../models/User';
import { UserProgress } from '../../models/UserProgress';
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
  ContentType,
  ContentTemplate,
  StructuredContent
} from '../../types/Content';

export class DynamicContentGenerator implements IContentGenerator {
  // ... existing code from 3.1.B.1 ...

  // Complete implementation of public methods
  async generateLesson(userId: number, topic: string, level: string, options: any = {}): Promise<GeneratedContent> {
    const request: ContentRequest = {
      userId,
      type: 'lesson',
      topics: [topic],
      level,
      duration: options.duration || 15,
      focusAreas: options.focusAreas || [],
      learningStyle: options.learningStyle || 'mixed',
      includeExercises: true,
      includeCulturalContext: true,
    };

    return this.generateContent(request);
  }

  async generateVocabularyDrill(userId: number, vocabularySet: string[], context: string): Promise<GeneratedContent> {
    const request: ContentRequest = {
      userId,
      type: 'vocabulary_drill',
      vocabulary: vocabularySet,
      context,
      includeAudio: true,
      includeExamples: true,
      difficulty: 'adaptive',
    };

    return this.generateContent(request);
  }

  async generateGrammarExercise(userId: number, grammarRule: string, difficulty: string): Promise<GeneratedContent> {
    const request: ContentRequest = {
      userId,
      type: 'grammar_exercise',
      grammarFocus: grammarRule,
      difficulty,
      includeExplanation: true,
      includeExamples: true,
      exerciseCount: 8,
    };

    return this.generateContent(request);
  }

  async generateCulturalContent(userId: number, culturalTopic: string, languageLevel: string): Promise<GeneratedContent> {
    const request: ContentRequest = {
      userId,
      type: 'cultural_content',
      culturalTopic,
      level: languageLevel,
      includeVocabulary: true,
      includeDiscussion: true,
      includeMultimedia: true,
    };

    return this.generateContent(request);
  }

  async generatePersonalizedExercise(userId: number, weakAreas: string[], timeAvailable: number): Promise<GeneratedContent> {
    const learningContext = await this.getLearningContext(userId);
    
    const request: ContentRequest = {
      userId,
      type: 'personalized_exercise',
      focusAreas: weakAreas,
      duration: timeAvailable,
      adaptToWeaknesses: true,
      reinforcePreviousLearning: true,
      level: learningContext.currentLevel,
    };

    return this.generateContent(request);
  }

  // Implement core generation methods
  private async generateRawContent(
    request: ContentRequest,
    template: ContentTemplate,
    context: LearningContext
  ): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Generate the prompt using the template engine
      const prompt = await this.promptEngine.generateContentPrompt({
        request,
        template,
        context,
      });

      // Get AI configuration for this content type
      const aiConfig = this.getAIConfigForType(request.type);
      
      // Call AI Orchestrator
      const aiResponse = await this.aiOrchestrator.generateContent(
        request.userId,
        request.type,
        {
          prompt,
          maxTokens: aiConfig.maxTokens,
          temperature: aiConfig.temperature,
          model: aiConfig.model,
        }
      );

      if (!aiResponse.success) {
        throw new Error(`AI generation failed: ${aiResponse.error}`);
      }

      // Parse the AI response
      const rawContent = this.parseAIResponse(aiResponse.data, request.type);
      
      // Store generation metadata
      const generationTime = Date.now() - startTime;
      rawContent._metadata = {
        generationTime,
        tokenUsage: aiResponse.tokenUsage,
        model: aiConfig.model,
        promptLength: prompt.length,
      };

      return rawContent;
    } catch (error) {
      // TODO: Implement structured logging (See Future Implementation #24)
      console.error('Raw content generation failed:', error);
      throw error;
    }
  }

  private async getLearningContext(userId: number): Promise<LearningContext> {
    try {
      // TODO: Implement optimized context loading (See Future Implementation #18)
      // For now, load from multiple sources and aggregate
      
      const user = await User.query().findById(userId);
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      const userProgress = await UserProgress.query()
        .where('userId', userId)
        .first();

      // Get recent activity and performance patterns
      const recentContent = await AIGeneratedContent.query()
        .where('userId', userId)
        .where('status', 'completed')
        .orderBy('createdAt', 'desc')
        .limit(10);

      // Extract learning patterns
      const recentTopics = recentContent
        .flatMap(content => content.topics || [])
        .filter((topic, index, arr) => arr.indexOf(topic) === index)
        .slice(0, 5);

      // TODO: Implement sophisticated weakness analysis from user progress
      const weakAreas = this.analyzeWeakAreas(userProgress, recentContent);
      const strengths = this.analyzeStrengths(userProgress, recentContent);

      return {
        userId,
        currentLevel: userProgress?.currentLevel || 'A1',
        learningStyle: user.preferences?.learningStyle || 'mixed',
        weakAreas,
        strengths,
        interests: user.preferences?.interests || [],
        recentTopics,
        performanceHistory: recentContent.map(content => ({
          type: content.type,
          score: content.validationScore,
          completedAt: content.lastAccessedAt,
        })),
        lastActivity: userProgress?.lastActivityDate,
        streakDays: userProgress?.streakDays || 0,
        totalLessons: userProgress?.lessonsCompleted || 0,
      };
    } catch (error) {
      console.error('Error loading learning context:', error);
      // Return minimal context as fallback
      return {
        userId,
        currentLevel: 'A1',
        learningStyle: 'mixed',
        weakAreas: [],
        strengths: [],
        interests: [],
        recentTopics: [],
        performanceHistory: [],
      };
    }
  }

  private async structureContent(content: any, request: ContentRequest): Promise<StructuredContent> {
    switch (request.type) {
      case 'lesson':
        return this.structureLesson(content, request);
      case 'vocabulary_drill':
        return this.structureVocabulary(content, request);
      case 'grammar_exercise':
        return this.structureGrammar(content, request);
      case 'cultural_content':
        return this.structureCultural(content, request);
      case 'personalized_exercise':
        return this.structurePersonalized(content, request);
      default:
        throw new Error(`Unknown content type: ${request.type}`);
    }
  }

  private structureLesson(content: any, request: ContentRequest): any {
    return {
      type: 'lesson' as const,
      title: content.title || `French Lesson: ${request.topics?.[0] || 'Practice'}`,
      description: content.description || 'Interactive French language lesson',
      learningObjectives: content.objectives || content.learningObjectives || [
        'Learn new vocabulary',
        'Practice grammar concepts',
        'Improve comprehension',
      ],
      estimatedTime: content.estimatedTime || request.duration || 15,
      sections: this.createLessonSections(content),
      vocabulary: this.extractVocabulary(content),
      grammar: content.grammar,
      culturalNotes: content.culturalNotes || [],
    };
  }

  private structureVocabulary(content: any, request: ContentRequest): any {
    return {
      type: 'vocabulary_drill' as const,
      title: content.title || 'Vocabulary Practice',
      description: content.description || 'Practice and learn new French vocabulary',
      context: content.context || request.context || 'General vocabulary practice',
      vocabulary: content.vocabulary?.map((item: any) => ({
        word: item.word,
        definition: item.definition,
        pronunciation: item.pronunciation || this.generatePronunciation(item.word),
        ipa: item.ipa,
        examples: item.examples || [],
        difficulty: item.difficulty || 'medium',
        culturalContext: item.culturalContext,
      })) || [],
      exercises: content.exercises || this.generateVocabularyExercises(content.vocabulary),
      culturalContext: content.culturalContext,
    };
  }

  private structureGrammar(content: any, request: ContentRequest): any {
    return {
      type: 'grammar_exercise' as const,
      title: content.title || `Grammar: ${request.grammarFocus}`,
      grammarRule: content.rule || request.grammarFocus || '',
      explanation: content.explanation || '',
      examples: content.examples || [],
      exercises: content.exercises?.map((ex: any) => ({
        type: ex.type || 'fill_blank',
        instruction: ex.instruction || 'Complete the exercise',
        items: ex.items || [],
        feedback: ex.feedback || 'Good work!',
        difficulty: ex.difficulty || request.difficulty,
      })) || [],
      tips: content.tips || [],
      commonMistakes: content.commonMistakes || [],
    };
  }

  private structureCultural(content: any, request: ContentRequest): any {
    return {
      type: 'cultural_content' as const,
      title: content.title || `Cultural Insight: ${request.culturalTopic}`,
      topic: content.topic || request.culturalTopic || '',
      description: content.description || '',
      keyPoints: content.keyPoints || [],
      vocabulary: this.extractVocabulary(content),
      discussionQuestions: content.discussionQuestions || [],
      multimedia: content.multimedia || [],
      connections: content.connections || [],
    };
  }

  private structurePersonalized(content: any, request: ContentRequest): any {
    return {
      type: 'personalized_exercise' as const,
      title: content.title || 'Personalized Practice',
      description: content.description || 'Exercises tailored to your learning needs',
      focusAreas: request.focusAreas || [],
      exercises: content.exercises || [],
      adaptiveElements: content.adaptiveElements || [],
    };
  }

  // Helper methods for content processing
  private createLessonSections(content: any): any[] {
    const sections = [];
    
    if (content.introduction) {
      sections.push({
        type: 'introduction',
        title: 'Introduction',
        content: content.introduction,
        duration: 2,
      });
    }

    if (content.presentation) {
      sections.push({
        type: 'presentation',
        title: 'New Content',
        content: content.presentation,
        vocabulary: content.vocabulary || [],
        grammar: content.grammar,
        duration: Math.ceil((content.estimatedTime || 15) * 0.4),
      });
    }

    if (content.practice || content.exercises) {
      sections.push({
        type: 'practice',
        title: 'Practice',
        content: content.practice || 'Practice what you\'ve learned',
        exercises: content.exercises || [],
        duration: Math.ceil((content.estimatedTime || 15) * 0.4),
      });
    }

    if (content.summary || content.wrapUp) {
      sections.push({
        type: 'wrap_up',
        title: 'Summary',
        content: content.summary || content.wrapUp,
        duration: 2,
      });
    }

    return sections;
  }

  private extractVocabulary(content: any): any[] {
    if (content.vocabulary && Array.isArray(content.vocabulary)) {
      return content.vocabulary;
    }
    
    // Extract vocabulary from content text if not explicitly provided
    // This is a simplified extraction - in production, use NLP
    return [];
  }

  private generateVocabularyExercises(vocabulary: any[]): any[] {
    if (!vocabulary || vocabulary.length === 0) return [];

    return [
      {
        type: 'matching',
        instruction: 'Match the French words with their English definitions',
        items: vocabulary.slice(0, 6).map(item => ({
          french: item.word,
          english: item.definition,
        })),
        feedback: 'Excellent vocabulary practice!',
      },
      {
        type: 'fill_blank',
        instruction: 'Fill in the blanks with the correct French words',
        items: vocabulary.slice(0, 4).map(item => ({
          sentence: `The French word for "${item.definition}" is ______.`,
          answer: item.word,
        })),
        feedback: 'Great job with vocabulary usage!',
      },
    ];
  }

  private generatePronunciation(word: string): string {
    // Simplified pronunciation generation
    // TODO: Integrate with proper French phonetics API
    const pronunciationMap: Record<string, string> = {
      'bonjour': 'bon-ZHOOR',
      'merci': 'mer-SEE',
      'au revoir': 'oh ruh-VWAHR',
      'comment': 'koh-MAHN',
      'ça va': 'sah VAH',
    };
    
    return pronunciationMap[word.toLowerCase()] || word;
  }

  private analyzeWeakAreas(userProgress: any, recentContent: any[]): string[] {
    // TODO: Implement sophisticated analysis based on performance data
    // For now, return common weak areas based on level
    const level = userProgress?.currentLevel || 'A1';
    
    const levelWeakAreas: Record<string, string[]> = {
      'A1': ['pronunciation', 'basic_grammar'],
      'A2': ['verb_conjugation', 'pronunciation'],
      'B1': ['subjunctive', 'complex_grammar'],
      'B2': ['advanced_vocabulary', 'idiomatic_expressions'],
      'C1': ['nuanced_grammar', 'cultural_references'],
      'C2': ['literary_language', 'regional_dialects'],
    };

    return levelWeakAreas[level] || levelWeakAreas['A1'];
  }

  private analyzeStrengths(userProgress: any, recentContent: any[]): string[] {
    // TODO: Implement sophisticated analysis based on performance data
    return ['vocabulary', 'reading_comprehension'];
  }

  private parseAIResponse(response: any, contentType: ContentType): any {
    try {
      // Handle different response formats from AI
      if (typeof response === 'string') {
        // Try to parse as JSON first
        try {
          return JSON.parse(response);
        } catch {
          // If not JSON, treat as plain text content
          return { content: response, type: contentType };
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Invalid AI response format');
    }
  }

  private getAIConfigForType(type: ContentType): any {
    // TODO: Move to external configuration (See review points)
    const configs = {
      lesson: {
        maxTokens: 2000,
        temperature: 0.7,
        model: 'gpt-3.5-turbo',
      },
      vocabulary_drill: {
        maxTokens: 1200,
        temperature: 0.6,
        model: 'gpt-3.5-turbo',
      },
      grammar_exercise: {
        maxTokens: 1500,
        temperature: 0.4,
        model: 'gpt-3.5-turbo',
      },
      cultural_content: {
        maxTokens: 1800,
        temperature: 0.8,
        model: 'gpt-3.5-turbo',
      },
      personalized_exercise: {
        maxTokens: 1000,
        temperature: 0.7,
        model: 'gpt-3.5-turbo',
      },
      pronunciation_drill: {
        maxTokens: 800,
        temperature: 0.5,
        model: 'gpt-3.5-turbo',
      },
      conversation_practice: {
        maxTokens: 1500,
        temperature: 0.8,
        model: 'gpt-3.5-turbo',
      },
    };

    return configs[type] || configs.lesson;
  }

  private adjustRequestFromValidation(request: ContentRequest, validation: any): ContentRequest {
    const adjusted = { ...request };
    
    if (validation.issues.includes('too_difficult')) {
      // Lower the difficulty level
      if (request.level) {
        adjusted.level = this.getLowerLevel(request.level);
      }
      adjusted.difficulty = 'easy';
    }
    
    if (validation.issues.includes('too_simple')) {
      // Raise the difficulty level
      if (request.level) {
        adjusted.level = this.getHigherLevel(request.level);
      }
      adjusted.difficulty = 'hard';
    }
    
    if (validation.issues.includes('insufficient_examples')) {
      adjusted.includeMoreExamples = true;
      if (adjusted.exerciseCount) {
        adjusted.exerciseCount = Math.min(adjusted.exerciseCount * 1.5, 12);
      }
    }

    if (validation.issues.includes('unclear_explanations')) {
      adjusted.includeExplanation = true;
      adjusted.includeExamples = true;
    }

    return adjusted;
  }

  private getLowerLevel(level: string): string {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(level);
    return currentIndex > 0 ? levels[currentIndex - 1] : level;
  }

  private getHigherLevel(level: string): string {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(level);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : level;
  }

  private getFallbackContent(request: ContentRequest): GeneratedContent {
    const fallbackContent = this.createBasicFallbackContent(request.type, request);

    return {
      id: this.generateContentId(),
      type: request.type,
      content: fallbackContent,
      metadata: {
        userId: request.userId,
        generatedAt: new Date(),
        level: request.level || 'A1',
        topics: request.topics || [],
        aiGenerated: false,
        version: '1.0',
        fallback: true,
      },
      validation: { 
        isValid: true, 
        score: 0.6, 
        issues: [],
        confidence: 0.5,
      },
      estimatedCompletionTime: 10,
      learningObjectives: ['Practice French basics'],
    };
  }

  private createBasicFallbackContent(type: ContentType, request: ContentRequest): any {
    switch (type) {
      case 'lesson':
        return {
          type: 'lesson' as const,
          title: 'Basic French Practice',
          description: 'Continue your French learning journey',
          learningObjectives: ['Practice French vocabulary', 'Review basic concepts'],
          estimatedTime: 10,
          sections: [
            {
              type: 'practice',
              title: 'Vocabulary Review',
              content: 'Practice common French words and phrases',
              duration: 10,
            },
          ],
          vocabulary: [
            {
              word: 'bonjour',
              definition: 'hello',
              pronunciation: 'bon-ZHOOR',
              examples: ['Bonjour, comment allez-vous?'],
              difficulty: 'easy',
            },
            {
              word: 'merci',
              definition: 'thank you',
              pronunciation: 'mer-SEE',
              examples: ['Merci beaucoup!'],
              difficulty: 'easy',
            },
          ],
          culturalNotes: [],
        };
      
      case 'vocabulary_drill':
        return {
          type: 'vocabulary_drill' as const,
          title: 'Basic Vocabulary Practice',
          description: 'Practice essential French vocabulary',
          context: 'Basic French words for everyday use',
          vocabulary: [
            {
              word: 'bonjour',
              definition: 'hello',
              pronunciation: 'bon-ZHOOR',
              examples: ['Bonjour!'],
              difficulty: 'easy',
            },
            {
              word: 'au revoir',
              definition: 'goodbye',
              pronunciation: 'oh ruh-VWAHR',
              examples: ['Au revoir!'],
              difficulty: 'easy',
            },
          ],
          exercises: [
            {
              type: 'matching',
              instruction: 'Match the words with their meanings',
              items: [
                { french: 'bonjour', english: 'hello' },
                { french: 'au revoir', english: 'goodbye' },
              ],
              feedback: 'Good work!',
            },
          ],
        };

      default:
        return {
          type,
          title: 'French Practice',
          description: 'Basic French language practice',
          content: 'Continue practicing French!',
        };
    }
  }
}
```

## **Files to Modify**
```
server/src/services/contentGeneration/DynamicContentGenerator.ts (complete implementation)
```

## **Dependencies**
- Task 3.1.B.2 (Database Schema) for AIGeneratedContent model
- Task 3.1.A (AI Orchestrator) for AI interaction
- Existing User and UserProgress models
- PromptTemplateEngine service

## **Review Points**
1. **Performance**: Verify learning context loading is optimized
2. **AI Integration**: Confirm proper error handling for AI service failures
3. **Content Quality**: Validate fallback content provides educational value
4. **Scalability**: Ensure the generation process can handle concurrent requests

## **Possible Issues & Solutions**
1. **Issue**: Learning context loading might be slow for users with lots of data
   - **Solution**: Implement caching and lazy loading (Future Implementation #18)
2. **Issue**: AI responses might be inconsistent in format
   - **Solution**: Robust parsing with multiple fallback strategies
3. **Issue**: Fallback content might be too basic
   - **Solution**: Create more sophisticated static content templates

## **Testing Strategy**
- Unit tests for each content structuring method
- Integration tests with mocked AI responses
- Performance tests for learning context loading
- Fallback content quality validation
- Edge case testing (missing data, API failures)

## **Performance Considerations**
- **Caching**: Implement intelligent caching for learning contexts
- **Async Processing**: Ensure all database operations are properly awaited
- **Memory Management**: Avoid loading unnecessary data for content generation
- **AI Optimization**: Use appropriate token limits and temperature settings

## **Next Steps**
After completion, proceed to Task 3.1.B.4 (Implement Validator & Enhancer Services)
