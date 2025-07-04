# Task 3.1.B.3.a: Implement Raw Content Generation

## **Task Information**
- **Task ID**: 3.1.B.3.a
- **Parent Task**: 3.1.B.3 (Core Generation Logic)
- **Estimated Time**: 0.75 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.2 (Async Workflow), Task 3.1.A (AI Orchestrator)
- **Status**: ✅ Completed

## **Objective**
Implement the `generateRawContent` method in `DynamicContentGenerator` to handle AI interaction, prompt generation, and response parsing.

## **Success Criteria**
- [x] `generateRawContent` method fully implemented
- [x] AI interaction with error handling
- [x] Response parsing with validation
- [x] Performance metrics tracking
- [x] Proper integration with AIOrchestrator

## **Implementation Details**

### **Files to Modify**
```
server/src/services/contentGeneration/DynamicContentGenerator.ts
server/src/config/aiContentConfig.ts (new)
```

### **1. Create AI Content Configuration**

```typescript
// server/src/config/aiContentConfig.ts
import { ContentType } from '../types/Content';

export interface AIModelConfig {
  maxTokens: number;
  temperature: number;
  model: string;
  timeout: number;
}

// Helper to get config from environment variables with a default value
const getEnv = (key: string, defaultValue: string): string => process.env[key] || defaultValue;
const getEnvInt = (key: string, defaultValue: number): number => parseInt(getEnv(key, String(defaultValue)), 10);
const getEnvFloat = (key: string, defaultValue: number): number => parseFloat(getEnv(key, String(defaultValue)));

export const AI_CONTENT_CONFIG: Record<ContentType, AIModelConfig> = {
  lesson: {
    maxTokens: getEnvInt('AI_LESSON_MAX_TOKENS', 2000),
    temperature: getEnvFloat('AI_LESSON_TEMPERATURE', 0.7),
    model: getEnv('AI_LESSON_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_LESSON_TIMEOUT', 30000),
  },
  vocabulary_drill: {
    maxTokens: getEnvInt('AI_VOCAB_MAX_TOKENS', 1200),
    temperature: getEnvFloat('AI_VOCAB_TEMPERATURE', 0.6),
    model: getEnv('AI_VOCAB_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_VOCAB_TIMEOUT', 25000),
  },
  grammar_exercise: {
    maxTokens: getEnvInt('AI_GRAMMAR_MAX_TOKENS', 1500),
    temperature: getEnvFloat('AI_GRAMMAR_TEMPERATURE', 0.4),
    model: getEnv('AI_GRAMMAR_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_GRAMMAR_TIMEOUT', 25000),
  },
  cultural_content: {
    maxTokens: getEnvInt('AI_CULTURE_MAX_TOKENS', 1800),
    temperature: getEnvFloat('AI_CULTURE_TEMPERATURE', 0.8),
    model: getEnv('AI_CULTURE_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_CULTURE_TIMEOUT', 30000),
  },
  personalized_exercise: {
    maxTokens: getEnvInt('AI_PERSONALIZED_MAX_TOKENS', 1000),
    temperature: getEnvFloat('AI_PERSONALIZED_TEMPERATURE', 0.7),
    model: getEnv('AI_PERSONALIZED_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_PERSONALIZED_TIMEOUT', 20000),
  },
  pronunciation_drill: {
    maxTokens: getEnvInt('AI_PRONUNCIATION_MAX_TOKENS', 800),
    temperature: getEnvFloat('AI_PRONUNCIATION_TEMPERATURE', 0.5),
    model: getEnv('AI_PRONUNCIATION_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_PRONUNCIATION_TIMEOUT', 20000),
  },
  conversation_practice: {
    maxTokens: getEnvInt('AI_CONVERSATION_MAX_TOKENS', 1500),
    temperature: getEnvFloat('AI_CONVERSATION_TEMPERATURE', 0.8),
    model: getEnv('AI_CONVERSATION_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_CONVERSATION_TIMEOUT', 25000),
  },
};

export const DEFAULT_AI_CONFIG: AIModelConfig = {
  maxTokens: getEnvInt('AI_DEFAULT_MAX_TOKENS', 1500),
  temperature: getEnvFloat('AI_DEFAULT_TEMPERATURE', 0.7),
  model: getEnv('AI_DEFAULT_MODEL', 'gpt-3.5-turbo'),
  timeout: getEnvInt('AI_DEFAULT_TIMEOUT', 25000),
};
```

### **2. Implement generateRawContent Method**

```typescript
// Add to DynamicContentGenerator class
private async generateRawContent(
  request: ContentRequest,
  template: ContentTemplate,
  context: LearningContext
): Promise<any> {
  // TODO: #28 - Refactor to an async job queue. This synchronous approach is a major bottleneck.
  // The API should return a job ID immediately, and a worker should handle this process.
  const startTime = Date.now();
  
  try {
    const prompt = await this.promptEngine.generateContentPrompt({
      request,
      template,
      context,
    });

    const aiConfig = this.getAIConfigForType(request.type);
    
    // TODO: Implement AbortController signal in AIOrchestrator to prevent floating promises.
    const aiResponse = await this.executeAIRequestWithTimeout(request, prompt, aiConfig);

    if (!aiResponse.success) {
      throw new AIGenerationError(`AI generation failed: ${aiResponse.error}`, { request });
    }

    const rawContent = this.parseAIResponse(aiResponse.data, request.type);
    
    this.addGenerationMetadata(rawContent, {
      generationTime: Date.now() - startTime,
      tokenUsage: aiResponse.tokenUsage,
      model: aiConfig.model,
      promptLength: prompt.length,
    });

    return rawContent;
  } catch (error) {
    const generationTime = Date.now() - startTime;
    
    // TODO: #24 - Implement a dedicated, structured Logger service (e.g., Pino).
    console.error('Raw content generation failed:', {
      // correlationId: request.correlationId, // Add for traceability
      userId: request.userId,
      type: request.type,
      duration: generationTime,
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Re-throw a more specific error
    throw new AIGenerationError('Failed to generate raw content', { originalError: error });
  }
}

private async executeAIRequestWithTimeout(request: ContentRequest, prompt: string, aiConfig: AIModelConfig): Promise<any> {
  return Promise.race([
    this.aiOrchestrator.generateContent(
      request.userId,
      request.type,
      {
        prompt,
        maxTokens: aiConfig.maxTokens,
        temperature: aiConfig.temperature,
        model: aiConfig.model,
      }
    ),
    this.createTimeoutPromise(aiConfig.timeout)
  ]);
}

private addGenerationMetadata(rawContent: any, metadata: { generationTime: number, tokenUsage: any, model: string, promptLength: number }): void {
  rawContent._metadata = {
    ...metadata,
    timestamp: new Date().toISOString(),
  };
}

private getAIConfigForType(type: ContentType): AIModelConfig {
  return AI_CONTENT_CONFIG[type] || DEFAULT_AI_CONFIG;
}

private parseAIResponse(response: any, contentType: ContentType): any {
  // TODO: #32 - Replace this with a robust Zod schema validation in Task 3.1.B.3b.
  // This current implementation is a defensive fallback, not a long-term solution.
  try {
    if (typeof response === 'object' && response !== null) {
      return response; // Already a valid object.
    }

    if (typeof response === 'string') {
      // Attempt to find and parse a JSON object within the string, e.g., ```json\n{...}\n```
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch && jsonMatch[0]) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          // Fall through if the extracted JSON is malformed
        }
      }
      // If no JSON found or parsing failed, treat as plain text.
      return { content: response, type: contentType };
    }
    
    throw new Error('AI response is not a valid object or string.');
  } catch (error) {
    // TODO: #24 - Use structured logger
    console.error('Error parsing AI response:', {
      contentType,
      responsePreview: typeof response === 'string' ? response.substring(0, 200) : String(response),
      error: error instanceof Error ? error.message : String(error)
    });
    throw new AIGenerationError('Invalid or unparsable AI response format');
  }
}

private createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`AI generation timeout after ${timeout}ms`));
    }, timeout);
  });
}
```

## **Dependencies**
- Task 3.1.A (AI Orchestrator) for `aiOrchestrator.generateContent`
- PromptTemplateEngine service for prompt generation
- ContentTemplate and LearningContext types

## **Review Points**
1. **Error Handling**: Verify timeout and error scenarios are properly handled
2. **Performance**: Check that metadata tracking doesn't impact performance
3. **AI Integration**: Confirm proper integration with AI Orchestrator
4. **Configuration**: Validate external configuration approach

## **Possible Issues & Solutions**
1. **Issue**: AI responses might be inconsistent in format
   - **Solution**: Robust parsing with multiple fallback strategies
2. **Issue**: Timeout handling might be too aggressive
   - **Solution**: Make timeouts configurable per content type
3. **Issue**: Token usage tracking might be inaccurate
   - **Solution**: Validate with AI Orchestrator response format

## **Testing Strategy**
- Unit tests for response parsing with various AI response formats
- Integration tests with mocked AI Orchestrator responses
- Timeout behavior testing
- Error handling validation
- Performance benchmarking with different content types

## **Next Steps**
After completion, proceed to Task 3.1.B.3.b (Implement Content Structuring)
