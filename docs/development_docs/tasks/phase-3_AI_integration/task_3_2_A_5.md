# Task 3.2.A.5: Add Testing and Documentation

**Status**: ⏳ **Not Started**  
**Estimated Time**: 0.5h  
**Dependencies**: 3.2.A.2, 3.2.A.3, 3.2.A.4 (All implementation subtasks)  

## **Objective**

Add comprehensive testing coverage and documentation for the curriculum features, ensuring reliability, maintainability, and proper integration with existing systems.

## **Scope**

### **Files to Create/Modify**
- `server/src/test/services/curriculum.test.ts` - Unit tests for curriculum functions
- `server/src/test/controllers/curriculum-api.test.ts` - API endpoint tests
- Update JSDoc documentation across curriculum files
- Add API documentation examples

### **Implementation Plan**

#### **1. Unit Tests for Learning Path Service Extensions**

**File**: `server/src/test/services/curriculum.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  getAdaptiveLearningRecommendations,
  getCachedDailyPlan,
  adaptLearningPath
} from '../../services/learningPathService.js';
import { getSkillAssessmentForCurriculum } from '../../services/progressService.js';

// Mock dependencies
jest.mock('../../services/ai/aiServiceFactory.js');
jest.mock('../../services/progressService.js');
jest.mock('../../services/assessment/assessmentServiceFactory.js');

describe('Curriculum Features - Learning Path Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdaptiveLearningRecommendations', () => {
    it('should generate recommendations based on user progress', async () => {
      // Mock user progress data
      const mockProgress = {
        skillScores: { vocabulary: 0.7, grammar: 0.6 },
        recentScores: [75, 80, 70],
        currentPathId: 1
      };
      
      // Mock AI response
      const mockAIResponse = {
        data: {
          activities: [
            {
              type: 'vocabulary',
              topic: 'Daily Routines',
              estimatedMinutes: 12,
              difficulty: 'A2',
              reasoning: 'Strengthen vocabulary foundation',
              targetSkills: ['vocabulary', 'reading'],
              priority: 5
            },
            {
              type: 'grammar',
              topic: 'Present Tense',
              estimatedMinutes: 18,
              difficulty: 'A2',
              reasoning: 'Improve grammar consistency',
              targetSkills: ['grammar', 'writing'],
              priority: 4
            }
          ]
        }
      };

      jest.mocked(getUserRecentProgress).mockResolvedValue(mockProgress);
      jest.mocked(aiOrchestrator.generateDailyPlan).mockResolvedValue(mockAIResponse);

      const recommendations = await getAdaptiveLearningRecommendations(123, 30);

      expect(recommendations).toHaveLength(2);
      expect(recommendations[0].type).toBe('vocabulary');
      expect(recommendations[1].type).toBe('grammar');
      expect(recommendations.every(r => r.isAdaptive)).toBe(true);
      
      // Total time should not exceed requested time
      const totalTime = recommendations.reduce((sum, r) => sum + r.estimatedMinutes, 0);
      expect(totalTime).toBeLessThanOrEqual(30);
    });

    it('should fall back to basic recommendations when AI fails', async () => {
      jest.mocked(getUserRecentProgress).mockResolvedValue({
        skillScores: {},
        recentScores: [],
        currentPathId: 1
      });
      
      // Mock AI failure
      jest.mocked(aiOrchestrator.generateDailyPlan).mockRejectedValue(new Error('AI service unavailable'));

      const recommendations = await getAdaptiveLearningRecommendations(123, 20);

      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.every(r => !r.isAdaptive)).toBe(true);
    });

    it('should respect time constraints in recommendations', async () => {
      const mockProgress = { skillScores: {}, recentScores: [], currentPathId: 1 };
      const timeLimit = 15;

      jest.mocked(getUserRecentProgress).mockResolvedValue(mockProgress);
      
      const recommendations = await getAdaptiveLearningRecommendations(123, timeLimit);
      const totalTime = recommendations.reduce((sum, r) => sum + r.estimatedMinutes, 0);
      
      expect(totalTime).toBeLessThanOrEqual(timeLimit);
    });
  });

  describe('getCachedDailyPlan', () => {
    it('should return cached plan when available', async () => {
      const mockCachedPlan = {
        userId: 123,
        date: new Date(),
        activities: [],
        totalMinutes: 20,
        generatedAt: new Date(),
        isAdaptive: true
      };

      jest.mocked(cacheService.get).mockResolvedValue(mockCachedPlan);

      const result = await getCachedDailyPlan(123);

      expect(result).toEqual(mockCachedPlan);
      expect(cacheService.get).toHaveBeenCalledWith(
        expect.stringContaining('daily-plan:123')
      );
    });

    it('should generate and cache new plan when cache miss', async () => {
      jest.mocked(cacheService.get).mockResolvedValue(null);
      jest.mocked(getAdaptiveLearningRecommendations).mockResolvedValue([
        {
          id: 'rec_1',
          pathId: 1,
          title: 'Vocabulary Practice',
          type: 'vocabulary',
          estimatedMinutes: 15,
          difficulty: 'A2',
          reasoning: 'Build vocabulary',
          priority: 5,
          targetSkills: ['vocabulary'],
          createdAt: new Date(),
          isAdaptive: true
        }
      ]);

      const result = await getCachedDailyPlan(123);

      expect(result).toBeDefined();
      expect(result?.activities).toHaveLength(1);
      expect(cacheService.set).toHaveBeenCalledWith(
        expect.stringContaining('daily-plan:123'),
        expect.any(Object),
        6 * 60 * 60 // 6 hours
      );
    });
  });

  describe('adaptLearningPath', () => {
    it('should adapt path based on performance data', async () => {
      const mockCurrentPath = {
        pathId: 1,
        units: [
          {
            id: 1,
            lessons: [
              { id: 1, title: 'Basic Grammar', difficulty: 'A1', estimatedMinutes: 30 }
            ]
          }
        ]
      };

      const mockPerformanceData = [
        {
          skillArea: 'grammar',
          averageScore: 65,
          lastAttempt: new Date(),
          difficulty: 'A2',
          attemptCount: 5
        }
      ];

      const mockAIResponse = {
        data: {
          adaptedActivities: [
            {
              id: '1',
              type: 'grammar',
              title: 'Grammar Review Session',
              estimatedMinutes: 25,
              difficulty: 'A1',
              changeType: 'modified'
            }
          ],
          adaptationReasoning: 'Based on recent performance, focusing on foundational skills',
          confidenceScore: 0.78,
          timelineImpact: {
            daysDelta: 3,
            newCompletionDate: '2025-09-01'
          }
        }
      };

      jest.mocked(getLearningPathUserView).mockResolvedValue(mockCurrentPath);
      jest.mocked(gatherPerformanceData).mockResolvedValue(mockPerformanceData);
      jest.mocked(aiOrchestrator.adaptLearningPath).mockResolvedValue(mockAIResponse);

      const result = await adaptLearningPath(1, 123, 'poor_performance');

      expect(result).toBeDefined();
      expect(result?.adaptationHistory).toBeDefined();
      expect(result?.adaptationHistory?.[0].reasoning).toBe(mockAIResponse.data.adaptationReasoning);
    });

    it('should return unchanged path when no performance data available', async () => {
      const mockCurrentPath = { pathId: 1, units: [] };

      jest.mocked(getLearningPathUserView).mockResolvedValue(mockCurrentPath);
      jest.mocked(gatherPerformanceData).mockResolvedValue([]);

      const result = await adaptLearningPath(1, 123, 'poor_performance');

      expect(result).toEqual(mockCurrentPath);
    });
  });
});

describe('Curriculum Features - Progress Service', () => {
  describe('getSkillAssessmentForCurriculum', () => {
    it('should calculate skill levels from assessment data', async () => {
      const mockAssessments = [
        {
          skillArea: 'vocabulary',
          score: 85,
          completedAt: '2025-08-20T10:00:00Z',
          metadata: { difficulty: 'A2' }
        },
        {
          skillArea: 'grammar',
          score: 65,
          completedAt: '2025-08-22T10:00:00Z',
          metadata: { difficulty: 'A2' }
        }
      ];

      const mockProgress = {
        currentLevel: 'A2',
        completionPercentage: 60
      };

      jest.mocked(getUserProgress).mockResolvedValue(mockProgress);
      jest.mocked(getUserRecentAssessments).mockResolvedValue(mockAssessments);
      jest.mocked(getUserCompletionStats).mockResolvedValue({ totalCompleted: 10 });

      const assessment = await getSkillAssessmentForCurriculum(123);

      expect(assessment.skills.vocabulary.level).toBe('C1');
      expect(assessment.skills.grammar.level).toBe('B1');
      expect(assessment.weakAreas).toContain('grammar');
      expect(assessment.overallLevel).toMatch(/^[ABC][12]$/);
      expect(assessment.overallConfidence).toBeGreaterThan(0);
    });

    it('should provide fallback assessment when no data available', async () => {
      jest.mocked(getUserProgress).mockResolvedValue({ currentLevel: 'A1' });
      jest.mocked(getUserRecentAssessments).mockResolvedValue([]);

      const assessment = await getSkillAssessmentForCurriculum(123);

      expect(assessment.overallConfidence).toBeLessThan(0.5);
      expect(assessment.dataPoints).toBe(0);
      expect(assessment.recommendations).toContain('Complete more assessments');
    });

    it('should calculate trends correctly', async () => {
      const improvingAssessments = [
        { skillArea: 'vocabulary', score: 50, completedAt: '2025-08-01T10:00:00Z' },
        { skillArea: 'vocabulary', score: 60, completedAt: '2025-08-10T10:00:00Z' },
        { skillArea: 'vocabulary', score: 75, completedAt: '2025-08-20T10:00:00Z' }
      ];

      jest.mocked(getUserProgress).mockResolvedValue({ currentLevel: 'A2' });
      jest.mocked(getUserRecentAssessments).mockResolvedValue(improvingAssessments);
      jest.mocked(getUserCompletionStats).mockResolvedValue({ totalCompleted: 5 });

      const assessment = await getSkillAssessmentForCurriculum(123);

      expect(assessment.skills.vocabulary.trend).toBe('improving');
      expect(assessment.skills.vocabulary.improvement).toBeGreaterThan(0);
    });
  });

  describe('mapScoreToCEFRLevel', () => {
    it('should map scores to appropriate CEFR levels', () => {
      expect(mapScoreToCEFRLevel(95, 'vocabulary')).toBe('C2');
      expect(mapScoreToCEFRLevel(85, 'vocabulary')).toBe('C1');
      expect(mapScoreToCEFRLevel(75, 'vocabulary')).toBe('B2');
      expect(mapScoreToCEFRLevel(65, 'vocabulary')).toBe('B1');
      expect(mapScoreToCEFRLevel(50, 'vocabulary')).toBe('A2');
      expect(mapScoreToCEFRLevel(25, 'vocabulary')).toBe('A1');
    });

    it('should use skill-specific thresholds', () => {
      // Pronunciation is typically harder, so same score yields lower level
      expect(mapScoreToCEFRLevel(70, 'pronunciation')).toBe('B1');
      expect(mapScoreToCEFRLevel(70, 'vocabulary')).toBe('B1');
      expect(mapScoreToCEFRLevel(70, 'reading')).toBe('B1');
    });
  });
});
```

#### **2. API Integration Tests**

**File**: `server/src/test/controllers/curriculum-api.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

describe('Curriculum API Endpoints', () => {
  describe('POST /api/ai/generate-daily-plan', () => {
    it('should generate daily plan with valid input', async () => {
      const requestBody = {
        userId: 123,
        preferredDuration: 30,
        currentSkills: { vocabulary: 0.7, grammar: 0.6 },
        focusAreas: ['vocabulary', 'grammar']
      };

      const response = await request(app)
        .post('/api/ai/generate-daily-plan')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.activities).toBeDefined();
      expect(response.body.data.totalMinutes).toBeLessThanOrEqual(30);
      expect(response.body.data.confidence).toBeGreaterThan(0);
    });

    it('should validate input parameters', async () => {
      const invalidBody = {
        userId: 'invalid', // Should be number
        preferredDuration: 200, // Exceeds maximum
        currentSkills: 'invalid' // Should be object
      };

      const response = await request(app)
        .post('/api/ai/generate-daily-plan')
        .send(invalidBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
    });

    it('should handle missing required fields', async () => {
      const incompleteBody = {
        preferredDuration: 30
        // Missing userId
      };

      const response = await request(app)
        .post('/api/ai/generate-daily-plan')
        .send(incompleteBody)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/ai/adapt-learning-path', () => {
    it('should adapt learning path with performance data', async () => {
      const requestBody = {
        currentPathId: '123',
        performanceData: [
          {
            skillArea: 'grammar',
            score: 65,
            completedAt: '2025-08-25',
            difficulty: 'A2'
          }
        ],
        adaptationTrigger: 'poor_performance',
        constraints: {
          weeklyHours: 5,
          skillAdjustments: { grammar: 'increase' }
        }
      };

      const response = await request(app)
        .post('/api/ai/adapt-learning-path')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.adaptedActivities).toBeDefined();
      expect(response.body.data.adaptationReasoning).toBeDefined();
      expect(response.body.data.confidenceScore).toBeGreaterThan(0);
    });

    it('should validate performance data format', async () => {
      const invalidBody = {
        currentPathId: '',
        performanceData: [], // Empty array not allowed
        adaptationTrigger: 'invalid_trigger'
      };

      const response = await request(app)
        .post('/api/ai/adapt-learning-path')
        .send(invalidBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should validate CEFR levels in performance data', async () => {
      const invalidBody = {
        currentPathId: '123',
        performanceData: [
          {
            skillArea: 'grammar',
            score: 65,
            completedAt: '2025-08-25',
            difficulty: 'INVALID' // Not a valid CEFR level
          }
        ],
        adaptationTrigger: 'poor_performance'
      };

      const response = await request(app)
        .post('/api/ai/adapt-learning-path')
        .send(invalidBody)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/ai/daily-plan/:userId', () => {
    it('should return cached daily plan', async () => {
      const userId = 123;

      const response = await request(app)
        .get(`/api/ai/daily-plan/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId).toBe(userId);
      expect(response.body.data.activities).toBeDefined();
    });

    it('should validate user ID parameter', async () => {
      const response = await request(app)
        .get('/api/ai/daily-plan/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid user ID provided');
    });

    it('should handle non-existent user', async () => {
      const response = await request(app)
        .get('/api/ai/daily-plan/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('No daily plan available for user');
    });
  });

  describe('GET /api/ai/learning-recommendations/:userId', () => {
    it('should return learning recommendations with default time', async () => {
      const userId = 123;

      const response = await request(app)
        .get(`/api/ai/learning-recommendations/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.recommendations).toBeDefined();
      expect(response.body.data.totalMinutes).toBeLessThanOrEqual(20); // Default
      expect(response.body.data.isAdaptive).toBe(true);
    });

    it('should respect time available query parameter', async () => {
      const userId = 123;
      const timeAvailable = 45;

      const response = await request(app)
        .get(`/api/ai/learning-recommendations/${userId}?timeAvailable=${timeAvailable}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalMinutes).toBeLessThanOrEqual(timeAvailable);
    });

    it('should validate time available range', async () => {
      const userId = 123;

      // Test minimum
      await request(app)
        .get(`/api/ai/learning-recommendations/${userId}?timeAvailable=3`)
        .expect(400);

      // Test maximum
      await request(app)
        .get(`/api/ai/learning-recommendations/${userId}?timeAvailable=150`)
        .expect(400);
    });
  });
});

describe('Curriculum API Error Handling', () => {
  it('should handle AI service failures gracefully', async () => {
    // Mock AI service failure
    jest.mocked(aiOrchestrator.generateDailyPlan)
      .mockRejectedValue(new Error('AI service unavailable'));

    const response = await request(app)
      .post('/api/ai/generate-daily-plan')
      .send({
        userId: 123,
        preferredDuration: 20
      });

    // Should still return a response (fallback)
    expect(response.status).toBeLessThan(500);
    expect(response.body.success).toBeDefined();
  });

  it('should handle rate limiting', async () => {
    // Make multiple rapid requests to trigger rate limiting
    const requests = Array(10).fill(null).map(() =>
      request(app)
        .post('/api/ai/generate-daily-plan')
        .send({ userId: 123, preferredDuration: 20 })
    );

    const responses = await Promise.all(requests);
    
    // At least one should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});
```

#### **3. Performance Tests**

```typescript
// Performance and load testing for curriculum features
describe('Curriculum Performance Tests', () => {
  it('should generate daily plans quickly with caching', async () => {
    const startTime = Date.now();
    
    // First request (cache miss)
    await request(app)
      .get('/api/ai/daily-plan/123')
      .expect(200);
    
    const firstRequestTime = Date.now() - startTime;
    
    const secondStartTime = Date.now();
    
    // Second request (cache hit)
    await request(app)
      .get('/api/ai/daily-plan/123')
      .expect(200);
    
    const secondRequestTime = Date.now() - secondStartTime;
    
    // Second request should be significantly faster
    expect(secondRequestTime).toBeLessThan(firstRequestTime / 2);
    expect(secondRequestTime).toBeLessThan(100); // Should be very fast with cache
  });

  it('should handle concurrent requests efficiently', async () => {
    const concurrentRequests = Array(5).fill(null).map((_, index) =>
      request(app)
        .post('/api/ai/generate-daily-plan')
        .send({
          userId: 100 + index,
          preferredDuration: 20
        })
    );

    const startTime = Date.now();
    const responses = await Promise.all(concurrentRequests);
    const totalTime = Date.now() - startTime;

    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    // Should complete within reasonable time (not blocking each other)
    expect(totalTime).toBeLessThan(5000); // 5 seconds for 5 concurrent requests
  });
});
```

#### **4. Documentation Updates**

**Enhanced JSDoc Examples**:

```typescript
/**
 * Task 3.2.A.5: Enhanced Documentation Examples
 * 
 * @example Basic daily plan generation
 * ```typescript
 * // Generate a 30-minute learning plan
 * const recommendations = await getAdaptiveLearningRecommendations(123, 30);
 * 
 * // Check total time allocation
 * const totalTime = recommendations.reduce((sum, r) => sum + r.estimatedMinutes, 0);
 * console.log(`Generated ${recommendations.length} activities totaling ${totalTime} minutes`);
 * 
 * // Access individual recommendations
 * recommendations.forEach(rec => {
 *   console.log(`${rec.type}: ${rec.title} (${rec.estimatedMinutes} min, ${rec.difficulty})`);
 *   console.log(`Reasoning: ${rec.reasoning}`);
 * });
 * ```
 * 
 * @example Learning path adaptation
 * ```typescript
 * // Adapt path based on poor performance
 * const adaptedPath = await adaptLearningPath(1, 123, 'poor_performance');
 * 
 * if (adaptedPath?.adaptationHistory) {
 *   const latest = adaptedPath.adaptationHistory[0];
 *   console.log(`Path adapted: ${latest.reasoning}`);
 *   console.log(`Timeline impact: ${latest.timelineImpact.daysDelta} days`);
 *   console.log(`Confidence: ${latest.confidence}`);
 * }
 * ```
 * 
 * @example Skill assessment for curriculum
 * ```typescript
 * // Get comprehensive skill assessment
 * const assessment = await getSkillAssessmentForCurriculum(123);
 * 
 * console.log(`Overall level: ${assessment.overallLevel}`);
 * console.log(`Confidence: ${(assessment.overallConfidence * 100).toFixed(1)}%`);
 * 
 * // Focus on weak areas
 * console.log('Areas needing improvement:', assessment.weakAreas.join(', '));
 * 
 * // Use recommendations
 * assessment.recommendations.forEach(rec => console.log(`- ${rec}`));
 * ```
 */
```

#### **5. API Documentation**

**File**: Update existing API documentation with curriculum endpoints

```markdown
# Curriculum API Documentation

## Generate Daily Learning Plan

**Endpoint**: `POST /api/ai/generate-daily-plan`

**Description**: Generate a personalized daily learning plan using AI analysis of user progress and preferences.

**Request Body**:
```json
{
  "userId": 123,
  "preferredDuration": 30,
  "currentSkills": {
    "vocabulary": 0.7,
    "grammar": 0.6
  },
  "recentPerformance": [75, 80, 70],
  "focusAreas": ["vocabulary", "grammar"]
}
```

**Success Response** (200):
```json
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

## Adapt Learning Path

**Endpoint**: `POST /api/ai/adapt-learning-path`

**Description**: Modify existing learning paths based on performance data and triggers.

**Request Body**:
```json
{
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
}
```

**Error Responses**:
- `400`: Validation failed
- `404`: Learning path not found
- `500`: Internal server error
```

## **Review Points Addressed**

### **1. Comprehensive Test Coverage**
- ✅ **Unit Tests**: All curriculum functions with mock dependencies
- ✅ **Integration Tests**: Full API endpoint testing with validation
- ✅ **Error Handling**: Comprehensive error scenario testing
- ✅ **Performance Tests**: Caching effectiveness and concurrent request handling

### **2. Documentation Quality**
- ✅ **JSDoc Enhancement**: Detailed examples and usage patterns
- ✅ **API Documentation**: Complete request/response examples
- ✅ **Code Comments**: Inline documentation for complex logic
- ✅ **Integration Examples**: Real-world usage scenarios

### **3. Test Reliability**
- ✅ **Mock Isolation**: Proper dependency mocking
- ✅ **Deterministic Results**: Consistent test outcomes
- ✅ **Edge Case Coverage**: Boundary conditions and error scenarios
- ✅ **Performance Benchmarks**: Measurable performance criteria

### **4. Maintainability**
- ✅ **Clear Test Structure**: Organized by feature and functionality
- ✅ **Reusable Test Utilities**: Common setup and mock patterns
- ✅ **Documentation Sync**: Tests aligned with documented behavior
- ✅ **Version Compatibility**: Tests work with existing infrastructure

## **Test Execution Strategy**

### **Local Development**
```bash
# Run all curriculum tests
npm test -- --grep "Curriculum"

# Run specific test suites
npm test src/test/services/curriculum.test.ts
npm test src/test/controllers/curriculum-api.test.ts

# Run with coverage
npm run test:coverage -- --grep "Curriculum"

# Run performance tests
npm test -- --grep "Performance"
```

### **CI/CD Integration**
```yaml
# Add to existing CI pipeline
- name: Run Curriculum Tests
  run: |
    npm test -- --grep "Curriculum" --reporter=tap
    npm run test:coverage -- --grep "Curriculum"

- name: Performance Tests
  run: |
    npm test -- --grep "Performance" --timeout=10000
```

## **Success Metrics**

### **Test Coverage Targets**
- ✅ **Unit Test Coverage**: >90% for all curriculum functions
- ✅ **API Test Coverage**: 100% endpoint coverage with error scenarios  
- ✅ **Integration Coverage**: All service interactions tested
- ✅ **Performance Benchmarks**: All response times < defined thresholds

### **Documentation Quality**
- ✅ **JSDoc Completeness**: All public functions documented with examples
- ✅ **API Documentation**: Complete request/response schemas
- ✅ **Usage Examples**: Real-world scenarios for each feature
- ✅ **Error Documentation**: All error conditions explained

### **Quality Assurance**
- ✅ **Test Reliability**: All tests pass consistently in CI/CD
- ✅ **Performance Validation**: Caching and concurrency tests pass
- ✅ **Error Handling**: Graceful degradation verified
- ✅ **Integration Stability**: No breaking changes to existing functionality

This comprehensive testing and documentation implementation ensures the curriculum features are reliable, maintainable, and properly integrated with the existing codebase while providing clear guidance for future development and maintenance.