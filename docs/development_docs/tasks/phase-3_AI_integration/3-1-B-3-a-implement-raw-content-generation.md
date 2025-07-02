# Task 3.1.B.3.a: Implement Raw Content Generation

## **Task Information**
- **Task ID**: 3.1.B.3.a
- **Parent Task**: 3.1.B.3 (Core Generation Logic)
- **Estimated Time**: 0.75 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.2 (Async Workflow), Task 3.1.A (AI Orchestrator)
- **Status**: ⏳ Not Started

## **Objective**
Implement the `generateRawContent` method in `DynamicContentGenerator` to handle AI interaction, prompt generation, and response parsing.

## **Success Criteria**
- [ ] `generateRawContent` method fully implemented
- [ ] AI interaction with error handling
- [ ] Response parsing with validation
- [ ] Performance metrics tracking
- [ ] Proper integration with AIOrchestrator

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
  timeout?: number;
}

export const AI_CONTENT_CONFIG: Record<ContentType, AIModelConfig> = {
  lesson: {
    maxTokens: 2000,
    temperature: 0.7,
    model: 'gpt-3.5-turbo',
    timeout: 30000,
  },
  vocabulary_drill: {
    maxTokens: 1200,
    temperature: 0.6,
    model: 'gpt-3.5-turbo',
    timeout: 25000,
  },
  grammar_exercise: {
    maxTokens: 1500,
    temperature: 0.4,
    model: 'gpt-3.5-turbo',
    timeout: 25000,
  },
  cultural_content: {
    maxTokens: 1800,
    temperature: 0.8,
    model: 'gpt-3.5-turbo',
    timeout: 30000,
  },
  personalized_exercise: {
    maxTokens: 1000,
    temperature: 0.7,
    model: 'gpt-3.5-turbo',
    timeout: 20000,
  },
  pronunciation_drill: {
    maxTokens: 800,
    temperature: 0.5,
    model: 'gpt-3.5-turbo',
    timeout: 20000,
  },
  conversation_practice: {
    maxTokens: 1500,
    temperature: 0.8,
    model: 'gpt-3.5-turbo',
    timeout: 25000,
  },
};

export const DEFAULT_AI_CONFIG: AIModelConfig = {
  maxTokens: 1500,
  temperature: 0.7,
  model: 'gpt-3.5-turbo',
  timeout: 25000,
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
    
    // Call AI Orchestrator with timeout
    const aiResponse = await Promise.race([
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
      this.createTimeoutPromise(aiConfig.timeout || 30000)
    ]);

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
      timestamp: new Date().toISOString(),
    };

    return rawContent;
  } catch (error) {
    const generationTime = Date.now() - startTime;
    
    // TODO: Reference Future Implementation #24 - Implement Structured Logging
    console.error('Raw content generation failed:', {
      userId: request.userId,
      type: request.type,
      duration: generationTime,
      error: error instanceof Error ? error.message : String(error)
    });
    
    throw error;
  }
}

private getAIConfigForType(type: ContentType): AIModelConfig {
  return AI_CONTENT_CONFIG[type] || DEFAULT_AI_CONFIG;
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
    
    // Validate that response has expected structure
    if (!response || typeof response !== 'object') {
      throw new Error('AI response is not a valid object');
    }
    
    return response;
  } catch (error) {
    console.error('Error parsing AI response:', {
      contentType,
      response: typeof response === 'string' ? response.substring(0, 200) : response,
      error: error instanceof Error ? error.message : String(error)
    });
    throw new Error('Invalid AI response format');
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
