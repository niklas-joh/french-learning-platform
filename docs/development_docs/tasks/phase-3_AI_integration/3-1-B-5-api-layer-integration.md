# Task 3.1.B.5: API Layer Integration

## **Task Information**
- **Task ID**: 3.1.B.5
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 0.5 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.4 (Implement Validator & Enhancer Services)
- **Status**: ⏳ Not Started

## **Objective**
Integrate the Dynamic Content Generation system with the existing API layer by adding new endpoints, updating controllers, and ensuring proper routing for all content generation features.

## **Success Criteria**
- [ ] New API endpoints for content generation implemented
- [ ] Existing AI controller updated with content generation methods
- [ ] Proper request validation and error handling in place
- [ ] API documentation updated
- [ ] Integration with existing authentication middleware
- [ ] Response formatting consistent with existing patterns

## **Implementation Details**

### **1. Update AI Controller**

Add content generation methods to the existing `aiController.ts`.

```typescript
// server/src/controllers/aiController.ts (additions)

import { Request, Response } from 'express';
import { DynamicContentGenerator } from '../services/contentGeneration/DynamicContentGenerator';
import { ContentValidatorFactory } from '../services/contentGeneration/factories/ContentValidatorFactory';
import { ContentEnhancerFactory } from '../services/contentGeneration/factories/ContentEnhancerFactory';
import { ContentTemplateManager } from '../services/contentGeneration/ContentTemplateManager';
import { AIOrchestrator } from '../services/ai/aiOrchestrator';
import { PromptTemplateEngine } from '../services/ai/promptTemplateEngine';
import { ContentRequest, ContentType } from '../types/Content';

// Add these methods to the existing AIController class

export class AIController {
  private contentGenerator: DynamicContentGenerator;

  constructor() {
    // Initialize content generator with dependencies
    const aiOrchestrator = new AIOrchestrator();
    const promptEngine = new PromptTemplateEngine();
    const validatorFactory = new ContentValidatorFactory();
    const enhancerFactory = new ContentEnhancerFactory();
    const templateManager = new ContentTemplateManager();

    this.contentGenerator = new DynamicContentGenerator(
      aiOrchestrator,
      promptEngine,
      validatorFactory,
      enhancerFactory,
      templateManager
    );
  }

  // ... existing methods ...

  /**
   * Generate dynamic content based on request
   * POST /api/ai/content/generate
   */
  async generateContent(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const contentRequest: ContentRequest = {
        userId,
        ...req.body,
      };

      // Validate request
      const validation = this.validateContentRequest(contentRequest);
      if (!validation.isValid) {
        res.status(400).json({
          error: 'Invalid content request',
          details: validation.errors,
        });
        return;
      }

      // Generate content
      const generatedContent = await this.contentGenerator.generateContent(contentRequest);

      res.status(200).json({
        success: true,
        data: generatedContent,
        message: 'Content generated successfully',
      });
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({
        error: 'Failed to generate content',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Generate a lesson
   * POST /api/ai/content/lesson
   */
  async generateLesson(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { topic, level, options = {} } = req.body;

      if (!topic || !level) {
        res.status(400).json({
          error: 'Missing required fields',
          details: 'topic and level are required',
        });
        return;
      }

      const lesson = await this.contentGenerator.generateLesson(userId, topic, level, options);

      res.status(200).json({
        success: true,
        data: lesson,
        message: 'Lesson generated successfully',
      });
    } catch (error) {
      console.error('Error generating lesson:', error);
      res.status(500).json({
        error: 'Failed to generate lesson',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Generate a vocabulary drill
   * POST /api/ai/content/vocabulary-drill
   */
  async generateVocabularyDrill(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { vocabularySet, context } = req.body;

      if (!vocabularySet || !Array.isArray(vocabularySet) || vocabularySet.length === 0) {
        res.status(400).json({
          error: 'Invalid vocabulary set',
          details: 'vocabularySet must be a non-empty array of words',
        });
        return;
      }

      if (!context) {
        res.status(400).json({
          error: 'Missing context',
          details: 'context is required for vocabulary drill generation',
        });
        return;
      }

      const drill = await this.contentGenerator.generateVocabularyDrill(userId, vocabularySet, context);

      res.status(200).json({
        success: true,
        data: drill,
        message: 'Vocabulary drill generated successfully',
      });
    } catch (error) {
      console.error('Error generating vocabulary drill:', error);
      res.status(500).json({
        error: 'Failed to generate vocabulary drill',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Generate a grammar exercise
   * POST /api/ai/content/grammar-exercise
   */
  async generateGrammarExercise(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { grammarRule, difficulty = 'medium' } = req.body;

      if (!grammarRule) {
        res.status(400).json({
          error: 'Missing grammar rule',
          details: 'grammarRule is required',
        });
        return;
      }

      const exercise = await this.contentGenerator.generateGrammarExercise(userId, grammarRule, difficulty);

      res.status(200).json({
        success: true,
        data: exercise,
        message: 'Grammar exercise generated successfully',
      });
    } catch (error) {
      console.error('Error generating grammar exercise:', error);
      res.status(500).json({
        error: 'Failed to generate grammar exercise',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Generate cultural content
   * POST /api/ai/content/cultural
   */
  async generateCulturalContent(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { culturalTopic, languageLevel } = req.body;

      if (!culturalTopic || !languageLevel) {
        res.status(400).json({
          error: 'Missing required fields',
          details: 'culturalTopic and languageLevel are required',
        });
        return;
      }

      const content = await this.contentGenerator.generateCulturalContent(userId, culturalTopic, languageLevel);

      res.status(200).json({
        success: true,
        data: content,
        message: 'Cultural content generated successfully',
      });
    } catch (error) {
      console.error('Error generating cultural content:', error);
      res.status(500).json({
        error: 'Failed to generate cultural content',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Generate personalized exercise
   * POST /api/ai/content/personalized-exercise
   */
  async generatePersonalizedExercise(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { weakAreas, timeAvailable = 15 } = req.body;

      if (!weakAreas || !Array.isArray(weakAreas) || weakAreas.length === 0) {
        res.status(400).json({
          error: 'Invalid weak areas',
          details: 'weakAreas must be a non-empty array',
        });
        return;
      }

      const exercise = await this.contentGenerator.generatePersonalizedExercise(userId, weakAreas, timeAvailable);

      res.status(200).json({
        success: true,
        data: exercise,
        message: 'Personalized exercise generated successfully',
      });
    } catch (error) {
      console.error('Error generating personalized exercise:', error);
      res.status(500).json({
        error: 'Failed to generate personalized exercise',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get content generation history for user
   * GET /api/ai/content/history
   */
  async getContentHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { page = 1, limit = 10, type } = req.query;

      // TODO: Implement history retrieval from AIGeneratedContent model
      // This would query the database for user's content generation history

      res.status(200).json({
        success: true,
        data: {
          content: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            totalPages: 0,
          },
        },
        message: 'Content history retrieved successfully',
      });
    } catch (error) {
      console.error('Error retrieving content history:', error);
      res.status(500).json({
        error: 'Failed to retrieve content history',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Helper method for request validation
  private validateContentRequest(request: ContentRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.userId) {
      errors.push('User ID is required');
    }

    if (!request.type) {
      errors.push('Content type is required');
    }

    const validTypes: ContentType[] = [
      'lesson',
      'vocabulary_drill',
      'grammar_exercise',
      'cultural_content',
      'personalized_exercise',
      'pronunciation_drill',
      'conversation_practice',
    ];

    if (request.type && !validTypes.includes(request.type)) {
      errors.push(`Invalid content type. Must be one of: ${validTypes.join(', ')}`);
    }

    if (request.duration && (request.duration < 1 || request.duration > 60)) {
      errors.push('Duration must be between 1 and 60 minutes');
    }

    if (request.level) {
      const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      if (!validLevels.includes(request.level)) {
        errors.push(`Invalid level. Must be one of: ${validLevels.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

### **2. Update AI Routes**

Add new routes to the existing `ai.routes.ts` file.

```typescript
// server/src/routes/ai.routes.ts (additions)

import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateContentRequest } from '../middleware/validation.middleware';

const router = Router();
const aiController = new AIController();

// ... existing routes ...

// Content generation routes
router.post('/content/generate', 
  authenticateToken, 
  validateContentRequest, 
  aiController.generateContent.bind(aiController)
);

router.post('/content/lesson', 
  authenticateToken, 
  aiController.generateLesson.bind(aiController)
);

router.post('/content/vocabulary-drill', 
  authenticateToken, 
  aiController.generateVocabularyDrill.bind(aiController)
);

router.post('/content/grammar-exercise', 
  authenticateToken, 
  aiController.generateGrammarExercise.bind(aiController)
);

router.post('/content/cultural', 
  authenticateToken, 
  aiController.generateCulturalContent.bind(aiController)
);

router.post('/content/personalized-exercise', 
  authenticateToken, 
  aiController.generatePersonalizedExercise.bind(aiController)
);

router.get('/content/history', 
  authenticateToken, 
  aiController.getContentHistory.bind(aiController)
);

export default router;
```

### **3. Create Validation Middleware**

Create middleware for validating content generation requests.

```typescript
// server/src/middleware/validation.middleware.ts (new file or addition)

import { Request, Response, NextFunction } from 'express';

export const validateContentRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { type, level, duration } = req.body;

  // Basic validation for content generation requests
  if (type) {
    const validTypes = [
      'lesson',
      'vocabulary_drill',
      'grammar_exercise',
      'cultural_content',
      'personalized_exercise',
      'pronunciation_drill',
      'conversation_practice',
    ];

    if (!validTypes.includes(type)) {
      res.status(400).json({
        error: 'Invalid content type',
        details: `Type must be one of: ${validTypes.join(', ')}`,
      });
      return;
    }
  }

  if (level) {
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!validLevels.includes(level)) {
      res.status(400).json({
        error: 'Invalid language level',
        details: `Level must be one of: ${validLevels.join(', ')}`,
      });
      return;
    }
  }

  if (duration && (typeof duration !== 'number' || duration < 1 || duration > 60)) {
    res.status(400).json({
      error: 'Invalid duration',
      details: 'Duration must be a number between 1 and 60 minutes',
    });
    return;
  }

  next();
};

export const validateVocabularyRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { vocabularySet } = req.body;

  if (!vocabularySet || !Array.isArray(vocabularySet) || vocabularySet.length === 0) {
    res.status(400).json({
      error: 'Invalid vocabulary set',
      details: 'vocabularySet must be a non-empty array of strings',
    });
    return;
  }

  if (vocabularySet.length > 20) {
    res.status(400).json({
      error: 'Vocabulary set too large',
      details: 'Maximum 20 vocabulary items allowed per request',
    });
    return;
  }

  // Validate each vocabulary item
  const invalidItems = vocabularySet.filter((item: any) => 
    typeof item !== 'string' || item.trim().length === 0
  );

  if (invalidItems.length > 0) {
    res.status(400).json({
      error: 'Invalid vocabulary items',
      details: 'All vocabulary items must be non-empty strings',
    });
    return;
  }

  next();
};
```

### **4. Update Dependency Injection**

Create a service factory for proper dependency management.

```typescript
// server/src/services/ServiceFactory.ts (new file)

import { DynamicContentGenerator } from './contentGeneration/DynamicContentGenerator';
import { ContentValidatorFactory } from './contentGeneration/factories/ContentValidatorFactory';
import { ContentEnhancerFactory } from './contentGeneration/factories/ContentEnhancerFactory';
import { ContentTemplateManager } from './contentGeneration/ContentTemplateManager';
import { AIOrchestrator } from './ai/aiOrchestrator';
import { PromptTemplateEngine } from './ai/promptTemplateEngine';

export class ServiceFactory {
  private static instance: ServiceFactory;
  private contentGenerator: DynamicContentGenerator | null = null;

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  getContentGenerator(): DynamicContentGenerator {
    if (!this.contentGenerator) {
      // TODO: Consider implementing proper DI container (See Future Implementation #23)
      const aiOrchestrator = new AIOrchestrator();
      const promptEngine = new PromptTemplateEngine();
      const validatorFactory = new ContentValidatorFactory();
      const enhancerFactory = new ContentEnhancerFactory();
      const templateManager = new ContentTemplateManager();

      this.contentGenerator = new DynamicContentGenerator(
        aiOrchestrator,
        promptEngine,
        validatorFactory,
        enhancerFactory,
        templateManager
      );
    }

    return this.contentGenerator;
  }

  // Method to reset instances for testing
  reset(): void {
    this.contentGenerator = null;
  }
}
```

### **5. API Documentation**

Add OpenAPI/Swagger documentation for the new endpoints.

```yaml
# docs/api/content-generation.yaml (new file)

paths:
  /api/ai/content/generate:
    post:
      summary: Generate dynamic content
      tags:
        - AI Content Generation
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ContentRequest'
      responses:
        '200':
          description: Content generated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    $ref: '#/components/schemas/GeneratedContent'
                  message:
                    type: string
                    example: "Content generated successfully"

  /api/ai/content/lesson:
    post:
      summary: Generate a French lesson
      tags:
        - AI Content Generation
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - topic
                - level
              properties:
                topic:
                  type: string
                  example: "greetings"
                level:
                  type: string
                  enum: [A1, A2, B1, B2, C1, C2]
                  example: "A1"
                options:
                  type: object
                  properties:
                    duration:
                      type: integer
                      minimum: 1
                      maximum: 60
                      example: 15
                    focusAreas:
                      type: array
                      items:
                        type: string
                      example: ["pronunciation", "vocabulary"]

components:
  schemas:
    ContentRequest:
      type: object
      required:
        - type
      properties:
        type:
          type: string
          enum:
            - lesson
            - vocabulary_drill
            - grammar_exercise
            - cultural_content
            - personalized_exercise
            - pronunciation_drill
            - conversation_practice
        level:
          type: string
          enum: [A1, A2, B1, B2, C1, C2]
        topics:
          type: array
          items:
            type: string
        duration:
          type: integer
          minimum: 1
          maximum: 60
        focusAreas:
          type: array
          items:
            type: string
        learningStyle:
          type: string
          enum: [visual, auditory, kinesthetic, mixed]

    GeneratedContent:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
        content:
          type: object
        metadata:
          type: object
        validation:
          type: object
        estimatedCompletionTime:
          type: integer
        learningObjectives:
          type: array
          items:
            type: string
```

## **Files to Create**
```
server/src/middleware/validation.middleware.ts (new file)
server/src/services/ServiceFactory.ts (new file)
docs/api/content-generation.yaml (new file)
```

## **Files to Modify**
```
server/src/controllers/aiController.ts (add content generation methods)
server/src/routes/ai.routes.ts (add content generation routes)
```

## **Dependencies**
- Task 3.1.B.4 (Validator & Enhancer Services)
- Existing authentication middleware
- AI Orchestrator service from Task 3.1.A

## **Review Points**
1. **Security**: Verify authentication is properly enforced on all endpoints
2. **Validation**: Confirm request validation covers all edge cases
3. **Error Handling**: Ensure consistent error response format
4. **Performance**: Validate that endpoints can handle expected load

## **Possible Issues & Solutions**
1. **Issue**: Service instantiation might be expensive
   - **Solution**: Use singleton pattern or DI container (Future Implementation #23)
2. **Issue**: Request validation might be inconsistent
   - **Solution**: Centralize validation logic in middleware
3. **Issue**: Error messages might expose internal details
   - **Solution**: Sanitize error messages for production

## **Testing Strategy**
- Unit tests for controller methods
- Integration tests for complete request/response cycles
- Authentication and authorization tests
- Request validation tests
- Error handling tests

## **API Design Principles**
- **RESTful**: Follow REST conventions for endpoint structure
- **Consistent**: Use consistent response format across all endpoints
- **Documented**: Comprehensive API documentation with examples
- **Secure**: Proper authentication and input validation
- **Performant**: Efficient request processing and response generation

## **Next Steps**
After completion, proceed to Task 3.1.B.6 (Update Architecture Documentation)
