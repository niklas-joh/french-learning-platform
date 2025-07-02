# Task 3.1.B.3.d: Implement Supporting Services

## **Task Information**
- **Task ID**: 3.1.B.3.d
- **Parent Task**: 3.1.B.3 (Core Generation Logic)
- **Estimated Time**: 0.5 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.3.c (User Context Service)
- **Status**: ⏳ Not Started

## **Objective**
Implement the remaining supporting services needed by `DynamicContentGenerator`: `ContentFallbackHandler`, `ContentGenerationMetrics`, and `adjustRequestFromValidation` method.

## **Success Criteria**
- [ ] `ContentFallbackHandler` service implemented
- [ ] `ContentGenerationMetrics` service implemented
- [ ] `adjustRequestFromValidation` method completed
- [ ] Integration with all supporting services
- [ ] Comprehensive error handling and metrics

## **Implementation Details**

### **Files to Create/Modify**
```
server/src/services/contentGeneration/ContentFallbackHandler.ts (new)
server/src/services/contentGeneration/ContentGenerationMetrics.ts (new)
server/src/services/contentGeneration/DynamicContentGenerator.ts (update methods)
content/fallback/ (fallback content files)
```

### **1. Create ContentFallbackHandler**

```typescript
// server/src/services/contentGeneration/ContentFallbackHandler.ts
import { ContentRequest, GeneratedContent, generateContentId } from '../../types/Content';
import { IContentFallbackHandler } from './interfaces';

/**
 * Handles content generation failures and provides fallback content
 */
export class ContentFallbackHandler implements IContentFallbackHandler {
  
  async getFallbackContent(request: ContentRequest, error: Error): Promise<GeneratedContent> {
    const fallbackContent = this.createBasicFallbackContent(request.type, request);

    return {
      id: generateContentId(),
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
        fallbackReason: error.message,
      },
      validation: { 
        isValid: true, 
        score: 0.6, 
        issues: [],
        confidence: 0.5,
      },
      estimatedCompletionTime: this.getEstimatedTime(request.type),
      learningObjectives: this.getFallbackObjectives(request.type),
    };
  }

  shouldRetry(error: Error, retryCount: number): boolean {
    // Don't retry for certain error types
    const nonRetryableErrors = [
      'timeout',
      'invalid_api_key',
      'quota_exceeded',
      'invalid_request_format'
    ];

    const errorMessage = error.message.toLowerCase();
    const isNonRetryable = nonRetryableErrors.some(errorType => 
      errorMessage.includes(errorType)
    );

    // Don't retry if it's a non-retryable error or we've already retried too much
    return !isNonRetryable && retryCount < 2;
  }

  private createBasicFallbackContent(type: string, request: ContentRequest): any {
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
            {
              word: 'merci',
              definition: 'thank you',
              pronunciation: 'mer-SEE',
              examples: ['Merci beaucoup!'],
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
                { french: 'merci', english: 'thank you' },
              ],
              feedback: 'Good work!',
            },
          ],
        };

      case 'grammar_exercise':
        return {
          type: 'grammar_exercise' as const,
          title: 'Basic Grammar Practice',
          grammarRule: 'Present tense of être (to be)',
          explanation: 'The verb être is one of the most important verbs in French.',
          examples: [
            'Je suis étudiant (I am a student)',
            'Tu es français (You are French)',
            'Il/Elle est content(e) (He/She is happy)',
          ],
          exercises: [
            {
              type: 'fill_blank',
              instruction: 'Fill in the correct form of être',
              items: [
                { sentence: 'Je ___ étudiant.', answer: 'suis' },
                { sentence: 'Tu ___ français.', answer: 'es' },
              ],
              feedback: 'Well done!',
            },
          ],
          tips: ['Remember that être is irregular'],
          commonMistakes: [],
        };

      case 'cultural_content':
        return {
          type: 'cultural_content' as const,
          title: 'French Culture Basics',
          topic: 'French Greetings',
          description: 'Learn about French greeting customs',
          keyPoints: [
            'French people often greet with a handshake or kisses on the cheek',
            'The number of kisses varies by region',
            'Always say "Bonjour" when entering a shop',
          ],
          vocabulary: [],
          discussionQuestions: [
            'How do greetings in France differ from your country?',
            'Why is politeness important in French culture?',
          ],
          multimedia: [],
          connections: [],
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

  private getEstimatedTime(type: string): number {
    const timeMap: Record<string, number> = {
      lesson: 15,
      vocabulary_drill: 10,
      grammar_exercise: 12,
      cultural_content: 20,
      personalized_exercise: 10,
      pronunciation_drill: 8,
      conversation_practice: 15,
    };
    
    return timeMap[type] || 10;
  }

  private getFallbackObjectives(type: string): string[] {
    const objectiveMap: Record<string, string[]> = {
      lesson: ['Practice French language skills', 'Review vocabulary'],
      vocabulary_drill: ['Learn new words', 'Practice pronunciation'],
      grammar_exercise: ['Understand grammar rules', 'Apply rules in context'],
      cultural_content: ['Learn about French culture', 'Develop cultural awareness'],
      personalized_exercise: ['Practice weak areas', 'Reinforce learning'],
      pronunciation_drill: ['Improve pronunciation', 'Practice sounds'],
      conversation_practice: ['Practice speaking', 'Build confidence'],
    };
    
    return objectiveMap[type] || ['Practice French'];
  }
}
```

### **2. Create ContentGenerationMetrics**

```typescript
// server/src/services/contentGeneration/ContentGenerationMetrics.ts
import { ContentRequest, ContentValidation } from '../../types/Content';
import { IContentGenerationMetrics } from './interfaces';

/**
 * Service for tracking content generation metrics and performance
 * TODO: Reference Future Implementation #24 - Implement Structured Logging
 */
export class ContentGenerationMetrics implements IContentGenerationMetrics {
  private metrics = {
    attempts: 0,
    successes: 0,
    failures: 0,
    validationFailures: 0,
    totalDuration: 0,
    averageDuration: 0,
  };

  recordGenerationAttempt(request: ContentRequest): void {
    this.metrics.attempts++;
    
    // Log attempt (TODO: Replace with structured logging)
    console.log('Content generation attempt:', {
      userId: request.userId,
      type: request.type,
      timestamp: new Date().toISOString(),
      totalAttempts: this.metrics.attempts,
    });
  }

  recordGenerationSuccess(request: ContentRequest, duration: number): void {
    this.metrics.successes++;
    this.metrics.totalDuration += duration;
    this.metrics.averageDuration = this.metrics.totalDuration / this.metrics.successes;
    
    console.log('Content generation success:', {
      userId: request.userId,
      type: request.type,
      duration,
      averageDuration: this.metrics.averageDuration,
      successRate: this.getSuccessRate(),
      timestamp: new Date().toISOString(),
    });
  }

  recordGenerationFailure(request: ContentRequest, error: Error): void {
    this.metrics.failures++;
    
    console.error('Content generation failure:', {
      userId: request.userId,
      type: request.type,
      error: error.message,
      failureRate: this.getFailureRate(),
      timestamp: new Date().toISOString(),
    });
  }

  recordValidationFailure(request: ContentRequest, validation: ContentValidation): void {
    this.metrics.validationFailures++;
    
    console.warn('Content validation failure:', {
      userId: request.userId,
      type: request.type,
      issues: validation.issues,
      score: validation.score,
      validationFailureRate: this.getValidationFailureRate(),
      timestamp: new Date().toISOString(),
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.getSuccessRate(),
      failureRate: this.getFailureRate(),
      validationFailureRate: this.getValidationFailureRate(),
    };
  }

  private getSuccessRate(): number {
    return this.metrics.attempts > 0 ? this.metrics.successes / this.metrics.attempts : 0;
  }

  private getFailureRate(): number {
    return this.metrics.attempts > 0 ? this.metrics.failures / this.metrics.attempts : 0;
  }

  private getValidationFailureRate(): number {
    return this.metrics.attempts > 0 ? this.metrics.validationFailures / this.metrics.attempts : 0;
  }

  resetMetrics(): void {
    this.metrics = {
      attempts: 0,
      successes: 0,
      failures: 0,
      validationFailures: 0,
      totalDuration: 0,
      averageDuration: 0,
    };
  }
}
```

### **3. Complete adjustRequestFromValidation Method**

```typescript
// Add to DynamicContentGenerator class
private adjustRequestFromValidation(
  request: ContentRequest, 
  validation: ContentValidation
): ContentRequest {
  const adjusted = { ...request };
  
  // Handle difficulty-related issues
  if (validation.issues.includes('too_difficult')) {
    // Lower the difficulty level
    if (request.level) {
      adjusted.level = this.getLowerLevel(request.level);
    }
    adjusted.difficulty = 'easy';
    
    // Reduce complexity
    if (adjusted.exerciseCount && adjusted.exerciseCount > 3) {
      adjusted.exerciseCount = Math.max(3, Math.floor(adjusted.exerciseCount * 0.7));
    }
  }
  
  if (validation.issues.includes('too_simple')) {
    // Raise the difficulty level
    if (request.level) {
      adjusted.level = this.getHigherLevel(request.level);
    }
    adjusted.difficulty = 'hard';
    
    // Increase complexity
    if (adjusted.exerciseCount) {
      adjusted.exerciseCount = Math.min(12, Math.ceil(adjusted.exerciseCount * 1.3));
    }
  }
  
  // Handle content quality issues
  if (validation.issues.includes('insufficient_examples')) {
    adjusted.includeMoreExamples = true;
    if (adjusted.exerciseCount) {
      adjusted.exerciseCount = Math.min(adjusted.exerciseCount * 1.5, 12);
    }
  }

  if (validation.issues.includes('unclear_explanations')) {
    adjusted.includeExplanation = true;
    adjusted.includeExamples = true;
    adjusted.detailLevel = 'high';
  }

  if (validation.issues.includes('missing_vocabulary')) {
    adjusted.includeVocabulary = true;
    adjusted.vocabularyCount = Math.max(adjusted.vocabularyCount || 5, 8);
  }

  if (validation.issues.includes('missing_cultural_context')) {
    adjusted.includeCulturalContext = true;
    adjusted.culturalContextLevel = 'detailed';
  }

  // Add retry metadata
  adjusted._retryAdjustment = {
    originalRequest: request,
    adjustmentReason: validation.issues,
    timestamp: new Date().toISOString(),
  };

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
```

### **4. Create Fallback Content Files**

```json
// content/fallback/basic-vocabulary.json
{
  "common_words": [
    { "word": "bonjour", "definition": "hello", "pronunciation": "bon-ZHOOR" },
    { "word": "au revoir", "definition": "goodbye", "pronunciation": "oh ruh-VWAHR" },
    { "word": "merci", "definition": "thank you", "pronunciation": "mer-SEE" },
    { "word": "s'il vous plaît", "definition": "please", "pronunciation": "see voo PLAY" },
    { "word": "excusez-moi", "definition": "excuse me", "pronunciation": "eks-koo-zay MWAH" }
  ],
  "basic_phrases": [
    { "phrase": "Comment allez-vous?", "translation": "How are you?", "pronunciation": "koh-mahn tah-lay VOO" },
    { "phrase": "Ça va bien", "translation": "I'm doing well", "pronunciation": "sah vah bee-AHN" },
    { "phrase": "Je ne comprends pas", "translation": "I don't understand", "pronunciation": "zhuh nuh kohn-prahn PAH" }
  ]
}
```

## **Dependencies**
- ContentRequest and ContentValidation types
- Interface definitions from interfaces.ts
- Task 3.1.B.3.c for integration

## **Review Points**
1. **Fallback Quality**: Verify fallback content provides educational value
2. **Metrics Accuracy**: Check that metrics properly track all scenarios
3. **Request Adjustment**: Validate adjustment logic improves validation success
4. **Error Handling**: Ensure graceful handling of all error types

## **Possible Issues & Solutions**
1. **Issue**: Fallback content might be too basic
   - **Solution**: Create more sophisticated fallback templates
2. **Issue**: Metrics might impact performance
   - **Solution**: Make metrics collection lightweight and async
3. **Issue**: Request adjustment might not address all validation issues
   - **Solution**: Expand adjustment logic based on validation feedback

## **Testing Strategy**
- Unit tests for fallback content generation
- Metrics tracking validation
- Request adjustment logic testing
- Integration testing with main generation flow
- Error scenario testing

## **Next Steps**
After completion, Task 3.1.B.3 (Core Generation Logic) will be complete.
