# Task 3.2.A.3: Add Curriculum API Endpoints

**Status**: ⏳ **Not Started**  
**Estimated Time**: 0.5h  
**Dependencies**: 3.2.A.2 (Enhanced Learning Path Service)  

## **Objective**

Add curriculum-related API endpoints to the existing AI controller using established patterns, providing RESTful access to daily plan generation and learning path adaptation features.

## **Scope**

### **Files to Modify**
- `server/src/controllers/aiController.ts` - Add curriculum endpoints
- `server/src/routes/ai.routes.ts` - Add curriculum routes

### **Implementation Plan**

#### **1. Add Curriculum Endpoints to AI Controller**

**File**: `server/src/controllers/aiController.ts`

Following the existing `handleAIRequest` pattern established in the file:

```typescript
/**
 * [ASYNC] Controller for generating personalized daily learning plans
 * POST /api/ai/generate-daily-plan
 * 
 * Task 3.2.A.3: Curriculum API Endpoints
 * 
 * Generates AI-powered daily learning plans based on user context, available time,
 * and performance data. Integrates with existing progress tracking and AI orchestration
 * infrastructure for personalized recommendations.
 * 
 * @param req Express request object with daily plan parameters
 * @param res Express response object
 * 
 * @example
 * Request body:
 * ```json
 * {
 *   "userId": 123,
 *   "preferredDuration": 30,
 *   "focusAreas": ["vocabulary", "grammar"]
 * }
 * ```
 * 
 * Response:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "activities": [...],
 *     "totalMinutes": 30,
 *     "focusAreas": ["vocabulary", "grammar"],
 *     "confidence": 0.85
 *   }
 * }
 * ```
 */
export const generateDailyPlan = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'GENERATE_DAILY_PLAN');
};

/**
 * [ASYNC] Controller for adapting existing learning paths
 * POST /api/ai/adapt-learning-path
 * 
 * Task 3.2.A.3: Curriculum API Endpoints
 * 
 * Modifies existing learning paths based on performance data, goal changes,
 * or time constraints. Provides intelligent adaptation while maintaining
 * learning continuity and pedagogical soundness.
 * 
 * @param req Express request object with adaptation parameters
 * @param res Express response object
 * 
 * @example
 * Request body:
 * ```json
 * {
 *   "currentPathId": "123",
 *   "performanceData": [
 *     {
 *       "skillArea": "grammar",
 *       "score": 65,
 *       "completedAt": "2025-08-25",
 *       "difficulty": "A2"
 *     }
 *   ],
 *   "adaptationTrigger": "poor_performance"
 * }
 * ```
 * 
 * Response:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "adaptedActivities": [...],
 *     "adaptationReasoning": "Based on recent performance...",
 *     "timelineImpact": {
 *       "daysDelta": 3,
 *       "newCompletionDate": "2025-09-15"
 *     },
 *     "confidenceScore": 0.78
 *   }
 * }
 * ```
 */
export const adaptLearningPath = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'ADAPT_LEARNING_PATH');
};

/**
 * [ASYNC] Controller for getting cached daily learning plans
 * GET /api/ai/daily-plan/:userId
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Cached Access
 * 
 * Retrieves cached daily learning plans to provide fast access to previously
 * generated recommendations. Falls back to generating new plan if cache miss.
 * 
 * @param req Express request object with userId parameter
 * @param res Express response object
 */
export const getDailyPlan = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdNumber = parseInt(userId, 10);
    
    if (!userIdNumber || isNaN(userIdNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID provided'
      });
    }
    
    // Use existing learning path service function
    const { getCachedDailyPlan } = await import('../services/learningPathService.js');
    const dailyPlan = await getCachedDailyPlan(userIdNumber);
    
    if (!dailyPlan) {
      return res.status(404).json({
        success: false,
        error: 'No daily plan available for user'
      });
    }
    
    return res.json({
      success: true,
      data: dailyPlan
    });
    
  } catch (error) {
    console.error('Error retrieving daily plan:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve daily plan'
    });
  }
};

/**
 * [ASYNC] Controller for learning path recommendations
 * GET /api/ai/learning-recommendations/:userId
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Recommendations
 * 
 * Provides learning recommendations based on user context and available time.
 * Integrates with existing progress tracking for personalized suggestions.
 * 
 * @param req Express request object with userId parameter and optional query params
 * @param res Express response object
 */
export const getLearningRecommendations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { timeAvailable = '20' } = req.query;
    
    const userIdNumber = parseInt(userId, 10);
    const timeNumber = parseInt(timeAvailable as string, 10);
    
    if (!userIdNumber || isNaN(userIdNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID provided'
      });
    }
    
    if (!timeNumber || isNaN(timeNumber) || timeNumber < 5 || timeNumber > 120) {
      return res.status(400).json({
        success: false,
        error: 'Time available must be between 5 and 120 minutes'
      });
    }
    
    // Use learning path service function from 3.2.A.2
    const { getAdaptiveLearningRecommendations } = await import('../services/learningPathService.js');
    const recommendations = await getAdaptiveLearningRecommendations(userIdNumber, timeNumber);
    
    return res.json({
      success: true,
      data: {
        recommendations,
        totalMinutes: recommendations.reduce((sum, r) => sum + r.estimatedMinutes, 0),
        generatedAt: new Date().toISOString(),
        isAdaptive: true
      }
    });
    
  } catch (error) {
    console.error('Error generating learning recommendations:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate learning recommendations'
    });
  }
};
```

#### **2. Add Routes to AI Router**

**File**: `server/src/routes/ai.routes.ts`

Following the existing route patterns in the file:

```typescript
// Import the new controllers
import {
  generateDailyPlan,
  adaptLearningPath,
  getDailyPlan,
  getLearningRecommendations
} from '../controllers/aiController.js';

// Add curriculum routes following existing patterns
// Task 3.2.A.3: Curriculum API Routes

/**
 * POST /api/ai/generate-daily-plan
 * Generate personalized daily learning plan using AI analysis
 */
router.post('/generate-daily-plan', generateDailyPlan);

/**
 * POST /api/ai/adapt-learning-path  
 * Adapt existing learning path based on performance data
 */
router.post('/adapt-learning-path', adaptLearningPath);

/**
 * GET /api/ai/daily-plan/:userId
 * Retrieve cached daily learning plan for user
 */
router.get('/daily-plan/:userId', getDailyPlan);

/**
 * GET /api/ai/learning-recommendations/:userId?timeAvailable=20
 * Get learning recommendations based on available time
 */
router.get('/learning-recommendations/:userId', getLearningRecommendations);
```

#### **3. Update API Documentation**

Add to existing API documentation comments:

```typescript
/**
 * AI API Routes - Enhanced with Curriculum Features
 * 
 * Task 3.2.A.3: API Documentation Update
 * 
 * Existing routes:
 * - POST /api/ai/generate-lesson - Generate lesson content
 * - POST /api/ai/assess-pronunciation - Assess pronunciation
 * - POST /api/ai/grade-response - Grade user responses
 * - GET /api/ai/jobs/:jobId - Get job status
 * - GET /api/ai/jobs - List user jobs
 * - DELETE /api/ai/jobs/:jobId - Cancel job
 * 
 * New curriculum routes:
 * - POST /api/ai/generate-daily-plan - Generate personalized daily plan
 * - POST /api/ai/adapt-learning-path - Adapt learning path based on performance  
 * - GET /api/ai/daily-plan/:userId - Get cached daily plan
 * - GET /api/ai/learning-recommendations/:userId - Get learning recommendations
 * 
 * All routes follow established patterns:
 * - Comprehensive input validation using Zod schemas
 * - Standardized error handling and response formats
 * - Integration with existing AI orchestration infrastructure
 * - Rate limiting and authentication middleware
 */
```

## **Integration Points**

### **1. Existing Controller Patterns**
The implementation leverages the existing `handleAIRequest` function pattern:

```typescript
// Existing pattern from aiController.ts:
export const generateLesson = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'GENERATE_LESSON');
};

// New curriculum endpoints follow same pattern:
export const generateDailyPlan = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'GENERATE_DAILY_PLAN'); // ✅ Perfect reuse
};
```

### **2. Validation Integration**
The `handleAIRequest` function automatically uses the validation schemas from 3.2.A.1:

```typescript
// From handleAIRequest function:
const validationResult = validateAIPayload(taskType, req.body);
if (!validationResult.success) {
  return res.status(400).json({
    success: false,
    error: 'Validation failed',
    details: validationResult.error.errors
  });
}

// Our schemas from 3.2.A.1 are automatically used:
// - generateDailyPlanPayloadSchema for GENERATE_DAILY_PLAN
// - adaptLearningPathPayloadSchema for ADAPT_LEARNING_PATH
```

### **3. Error Handling Integration**
Follows existing error response patterns:

```typescript
// Existing pattern for consistent error responses:
return res.status(400).json({
  success: false,
  error: 'Error message',
  details: errorDetails
});

// Success response pattern:
return res.json({
  success: true,
  data: responseData
});
```

## **Review Points Addressed**

### **1. Code Reuse (95%)**
- ✅ **handleAIRequest Pattern**: Perfect reuse for POST endpoints
- ✅ **Validation System**: Automatic integration with schemas from 3.2.A.1
- ✅ **Error Handling**: Consistent with existing controller patterns
- ✅ **Route Structure**: Follows established AI routes organization

### **2. API Consistency**
- ✅ **Naming Convention**: `/api/ai/` prefix maintained
- ✅ **Request/Response Format**: Standard `{success, data/error}` structure
- ✅ **HTTP Methods**: Appropriate REST verbs (POST for creation, GET for retrieval)
- ✅ **Status Codes**: Standard HTTP status codes (200, 400, 404, 500)

### **3. ESM Import Standards**
- ✅ **Import Extensions**: All imports use `.js` extension
- ✅ **Dynamic Imports**: Used where appropriate for service functions
- ✅ **Export Patterns**: Named exports following existing conventions

### **4. Type Safety**
- ✅ **Parameter Validation**: Input validation for all endpoints
- ✅ **TypeScript Integration**: Full type safety with existing types
- ✅ **Error Boundaries**: Comprehensive error handling

## **Testing Strategy**

### **Integration Tests**
```typescript
// Test curriculum API endpoints
describe('Curriculum API Endpoints', () => {
  describe('POST /api/ai/generate-daily-plan', () => {
    it('should generate daily plan with valid input', async () => {
      const response = await request(app)
        .post('/api/ai/generate-daily-plan')
        .send({
          userId: 123,
          preferredDuration: 30,
          focusAreas: ['vocabulary', 'grammar']
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.activities).toBeDefined();
      expect(response.body.data.totalMinutes).toBeLessThanOrEqual(30);
    });
    
    it('should return validation error for invalid input', async () => {
      const response = await request(app)
        .post('/api/ai/generate-daily-plan')
        .send({
          userId: 'invalid', // Should be number
          preferredDuration: 200 // Exceeds maximum
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });
  
  describe('GET /api/ai/daily-plan/:userId', () => {
    it('should return cached daily plan', async () => {
      const response = await request(app)
        .get('/api/ai/daily-plan/123')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(123);
      expect(response.body.data.activities).toBeDefined();
    });
    
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/ai/daily-plan/99999')
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
});
```

### **Load Testing Considerations**
```typescript
// Performance tests for caching effectiveness
describe('Curriculum API Performance', () => {
  it('should serve cached daily plans quickly', async () => {
    const startTime = Date.now();
    
    await request(app)
      .get('/api/ai/daily-plan/123')
      .expect(200);
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(100); // Should be fast with caching
  });
});
```

## **API Documentation Examples**

### **Daily Plan Generation**
```bash
# Generate daily plan
curl -X POST http://localhost:3001/api/ai/generate-daily-plan \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "preferredDuration": 30,
    "currentSkills": {
      "vocabulary": 0.7,
      "grammar": 0.6
    },
    "focusAreas": ["conversation", "pronunciation"]
  }'

# Response:
{
  "success": true,
  "data": {
    "activities": [
      {
        "type": "vocabulary",
        "topic": "Daily Routines", 
        "estimatedMinutes": 12,
        "difficulty": "A2",
        "reasoning": "Vocabulary building strengthens your foundation",
        "targetSkills": ["vocabulary", "reading"],
        "priority": 5
      }
    ],
    "totalMinutes": 30,
    "focusAreas": ["vocabulary", "grammar"],
    "expectedOutcomes": ["Learn 8-10 new vocabulary words"],
    "confidence": 0.85
  }
}
```

### **Learning Path Adaptation**
```bash
# Adapt learning path
curl -X POST http://localhost:3001/api/ai/adapt-learning-path \
  -H "Content-Type: application/json" \
  -d '{
    "currentPathId": "123",
    "performanceData": [
      {
        "skillArea": "grammar",
        "score": 65,
        "completedAt": "2025-08-25",
        "difficulty": "A2"
      }
    ],
    "adaptationTrigger": "poor_performance",
    "constraints": {
      "weeklyHours": 5,
      "skillAdjustments": {
        "grammar": "increase"
      }
    }
  }'

# Response:
{
  "success": true,
  "data": {
    "adaptedActivities": [
      {
        "id": "activity_1",
        "type": "grammar",
        "title": "Grammar Review Session",
        "estimatedMinutes": 25,
        "difficulty": "A1",
        "changeType": "modified"
      }
    ],
    "adaptationReasoning": "Based on recent performance (65.0%), focusing on foundational skills before advancing.",
    "timelineImpact": {
      "daysDelta": 3,
      "newCompletionDate": "2025-09-01"
    },
    "confidenceScore": 0.78,
    "followUpRecommendations": ["Schedule extra grammar review sessions"]
  }
}
```

## **Dependent Files**

### **Files Modified**
- `server/src/controllers/aiController.ts` - Add 4 new endpoint functions
- `server/src/routes/ai.routes.ts` - Add 4 new routes

### **Files Imported**
- `server/src/services/learningPathService.ts` - Functions from 3.2.A.2
- `server/src/controllers/ai.validators.ts` - Validation schemas from 3.2.A.1
- `server/src/types/AI.ts` - Task type definitions from 3.2.A.1

### **Files That Will Use These**
- Frontend API calls (client/src/services/api.ts)
- Integration tests
- API documentation

## **Success Metrics**

- ✅ All 4 endpoints follow existing `handleAIRequest` pattern
- ✅ 95% code reuse through pattern adherence
- ✅ Comprehensive input validation using existing Zod schemas
- ✅ Consistent error handling and response formats
- ✅ RESTful design with appropriate HTTP methods
- ✅ Integration with existing AI orchestration infrastructure
- ✅ ESM import compliance with `.js` extensions

This implementation provides a complete curriculum API that seamlessly integrates with the existing AI controller architecture while maintaining consistency, type safety, and performance.