# AI Curriculum Features Testing Methodology

**Date**: August 27, 2025  
**Task**: Test implementations for Task 3.2.A (Adaptive Curriculum Engine)  
**Testing Framework**: Component Testing Methodology + API Testing  
**Status**: Ready for execution by AI Agent or Manual Testing

## Executive Summary

The AI curriculum features have been implemented with:
- ✅ **API Layer**: Complete with all endpoints and validation
- ✅ **Type Safety**: Comprehensive TypeScript definitions
- ✅ **Frontend Components**: AI dashboard with hooks and components
- ⚠️ **AI Services**: Currently using intelligent stubs (not real AI)
- ⚠️ **Data Persistence**: No database storage implemented

## Testing Prerequisites

### Environment Setup Commands
```bash
# Terminal 1: Start client
cd client && npm run dev
# Expected: Client running on http://localhost:5175/

# Terminal 2: Start server  
cd server && npm run dev
# Expected: Server running on http://localhost:3001/
# Note: Fixed duplicate export issue in aiController.ts
```

### Required Tools
- Browser developer tools (Network tab, Console tab)
- API testing tool (curl, Postman, or similar)
- Screenshots for documentation

## Phase 2A: Curriculum API Endpoints Testing

### Test 1: POST /api/ai/curriculum/daily-plan
**Purpose**: Test AI-powered daily learning plan generation

**Test Cases:**

#### Test 1.1: Valid Request
```bash
curl -X POST http://localhost:3001/api/ai/curriculum/daily-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [VALID_TOKEN]" \
  -d '{
    "userId": 123,
    "preferredDuration": 30,
    "currentSkills": {"vocabulary": 0.7, "grammar": 0.6},
    "recentPerformance": [0.75, 0.82, 0.69],
    "focusAreas": ["conversation", "vocabulary"]
  }'
```

**Expected Response Structure:**
```json
{
  "status": "success",
  "data": {
    "activities": [
      {
        "type": "vocabulary|grammar|conversation|listening|reading|writing|pronunciation|culture",
        "topic": "string",
        "estimatedMinutes": "number",
        "difficulty": "A1|A2|B1|B2|C1|C2",
        "reasoning": "string",
        "targetSkills": ["array of strings"],
        "priority": "1-5"
      }
    ],
    "totalMinutes": 30,
    "focusAreas": ["conversation", "vocabulary"],
    "expectedOutcomes": ["array of strings"],
    "confidence": "number 0-1"
  },
  "metadata": {
    "provider": "stub",
    "model": "stub-model-v1",
    "processingTimeMs": "number",
    "cacheHit": false
  }
}
```

**Validation Checklist:**
- [ ] HTTP 200 status code
- [ ] Response matches TypeScript interface AITaskPayloads['GENERATE_DAILY_PLAN']['response']
- [ ] Total minutes matches requested preferredDuration
- [ ] Activities include focus areas specified
- [ ] All required fields present
- [ ] CEFR difficulty levels are valid
- [ ] Activity types are valid enum values

#### Test 1.2: Invalid Request - Missing Required Fields
```bash
curl -X POST http://localhost:3001/api/ai/curriculum/daily-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [VALID_TOKEN]" \
  -d '{
    "preferredDuration": 30
  }'
```

**Expected Response:**
- HTTP 400 status code
- Validation error details
- Code: 'VALIDATION_ERROR'

#### Test 1.3: Authentication Required
```bash
curl -X POST http://localhost:3001/api/ai/curriculum/daily-plan \
  -H "Content-Type: application/json" \
  -d '{"userId": 123, "preferredDuration": 30}'
```

**Expected Response:**
- HTTP 401 status code
- Message: 'Authentication required.'
- Code: 'AUTH_REQUIRED'

### Test 2: POST /api/ai/curriculum/adapt-path
**Purpose**: Test learning path adaptation based on performance

#### Test 2.1: Poor Performance Adaptation
```bash
curl -X POST http://localhost:3001/api/ai/curriculum/adapt-path \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [VALID_TOKEN]" \
  -d '{
    "currentPathId": "path_123",
    "performanceData": [
      {"skillArea": "grammar", "score": 45, "completedAt": "2025-08-25", "difficulty": "A2"},
      {"skillArea": "vocabulary", "score": 52, "completedAt": "2025-08-24", "difficulty": "A2"}
    ],
    "adaptationTrigger": "poor_performance",
    "constraints": {
      "weeklyHours": 5,
      "skillAdjustments": {"grammar": "increase"}
    }
  }'
```

**Expected Response Analysis:**
- [ ] adaptedActivities include easier grammar activities
- [ ] adaptationReasoning mentions poor performance (average < 70%)
- [ ] timelineImpact shows positive daysDelta (more time needed)
- [ ] followUpRecommendations include remedial suggestions

#### Test 2.2: Excellent Progress Adaptation  
```bash
curl -X POST http://localhost:3001/api/ai/curriculum/adapt-path \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [VALID_TOKEN]" \
  -d '{
    "currentPathId": "path_456", 
    "performanceData": [
      {"skillArea": "grammar", "score": 88, "completedAt": "2025-08-25", "difficulty": "A2"},
      {"skillArea": "vocabulary", "score": 92, "completedAt": "2025-08-24", "difficulty": "A2"}
    ],
    "adaptationTrigger": "excellent_progress"
  }'
```

**Expected Response Analysis:**
- [ ] adaptedActivities include more challenging content
- [ ] adaptationReasoning mentions great progress (average > 70%)
- [ ] timelineImpact shows negative daysDelta (faster completion)
- [ ] followUpRecommendations include advancement suggestions

### Test 3: GET /api/ai/curriculum/daily-plan/:userId
**Purpose**: Test cached daily plan retrieval

#### Test 3.1: Retrieve Daily Plan
```bash
curl -X GET http://localhost:3001/api/ai/curriculum/daily-plan/123 \
  -H "Authorization: Bearer [VALID_TOKEN]"
```

**Expected Response Structure:**
```json
{
  "status": "success",
  "data": {
    "planId": "string",
    "userId": 123,
    "date": "YYYY-MM-DD",
    "activities": [...],
    "totalMinutes": "number",
    "generatedAt": "ISO string",
    "isAdaptive": true
  }
}
```

#### Test 3.2: Non-existent User
```bash
curl -X GET http://localhost:3001/api/ai/curriculum/daily-plan/99999 \
  -H "Authorization: Bearer [VALID_TOKEN]"
```

**Expected**: HTTP 404 or appropriate error response

### Test 4: GET /api/ai/curriculum/recommendations/:userId
**Purpose**: Test learning recommendations based on available time

#### Test 4.1: Short Time Available
```bash
curl -X GET "http://localhost:3001/api/ai/curriculum/recommendations/123?timeAvailable=15" \
  -H "Authorization: Bearer [VALID_TOKEN]"
```

**Expected Analysis:**
- [ ] totalMinutes ≤ 15
- [ ] Recommendations prioritized for short sessions
- [ ] Higher priority items included first

#### Test 4.2: Longer Time Available
```bash  
curl -X GET "http://localhost:3001/api/ai/curriculum/recommendations/123?timeAvailable=60" \
  -H "Authorization: Bearer [VALID_TOKEN]"
```

**Expected Analysis:**
- [ ] More comprehensive recommendations
- [ ] Mix of different activity types
- [ ] totalMinutes utilizes available time effectively

## Phase 2B: Legacy AI Endpoints Testing

### Test 5: POST /api/ai/assess-pronunciation
```bash
curl -X POST http://localhost:3001/api/ai/assess-pronunciation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [VALID_TOKEN]" \
  -d '{
    "audioUrl": "https://example.com/audio.mp3",
    "expectedPhrase": "Bonjour, comment allez-vous?"
  }'
```

**Expected Response:**
- score: number 70-100 (stubbed random range)
- feedback: string with pronunciation guidance
- improvements: array of improvement suggestions

### Test 6: POST /api/ai/grade-response
```bash
curl -X POST http://localhost:3001/api/ai/grade-response \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [VALID_TOKEN]" \
  -d '{
    "userResponse": "Je suis étudiant",
    "correctAnswer": "Je suis étudiant",
    "questionType": "translation"
  }'
```

**Expected Response:**
- isCorrect: true (exact match)
- score: 80-100 range for correct answers
- feedback: positive feedback for correct responses

### Test 7: POST /api/ai/generate-lesson
```bash
curl -X POST http://localhost:3001/api/ai/generate-lesson \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [VALID_TOKEN]" \
  -d '{
    "topic": "French greetings",
    "level": "A1",
    "duration": 20,
    "includeExercises": true
  }'
```

**Expected Response:**
- Lesson object with id, title, content
- metadata with level, estimatedDuration, topics

## Phase 3: Frontend Integration Testing

### Test 8: HomePage AI Dashboard
**Access**: Navigate to http://localhost:5175/

#### Test 8.1: Initial Render
**Verification Checklist:**
- [ ] AI Dashboard components render without errors
- [ ] No JavaScript console errors
- [ ] Loading states display appropriately
- [ ] Responsive design works on different screen sizes

#### Test 8.2: AI Dashboard Components
1. **AIDashboardLayout Component**
   - [ ] Renders proper layout structure
   - [ ] Offline banner shows when simulated offline
   - [ ] Error boundaries handle component errors gracefully

2. **AIContentRequest Component**  
   - [ ] Content generation form renders
   - [ ] Form validation works
   - [ ] Submission triggers appropriate API calls

3. **QuickActionCard Component**
   - [ ] Action cards render with proper styling
   - [ ] Click handlers execute without errors
   - [ ] Loading states work during actions

4. **AITutorCard Component**
   - [ ] Tutor card displays correctly
   - [ ] Interactive elements respond to clicks
   - [ ] Content updates appropriately

#### Test 8.3: Hook Integration Testing
1. **useAIDashboard Hook**
   - [ ] Loads daily plan data
   - [ ] Handles loading states
   - [ ] Manages error states appropriately
   - [ ] clearError function works

2. **useAIContentGeneration Hook**
   - [ ] generateContent function available
   - [ ] isGenerating state tracks correctly
   - [ ] jobStatuses updates appropriately

## Phase 4: End-to-End Integration Testing

### Test 9: Full Daily Plan Generation Workflow
1. **Frontend Action**: Click "Generate Daily Plan" on HomePage
2. **Expected Flow**:
   - Frontend → API validation → AI Orchestrator → Stubbed response → Frontend update
3. **Verification Points**:
   - [ ] Network request shows proper payload
   - [ ] API responds with expected format
   - [ ] Frontend updates with new plan data
   - [ ] Loading states work throughout process
   - [ ] Error handling works for failed requests

### Test 10: Learning Path Adaptation Workflow  
1. **Simulation**: Modify performance data and trigger adaptation
2. **Expected Flow**: 
   - Performance data → Adaptation trigger → AI analysis → Path modification
3. **Verification Points**:
   - [ ] Performance thresholds trigger appropriate adaptations
   - [ ] Adaptation reasoning matches performance data
   - [ ] Timeline impact calculations are logical
   - [ ] UI updates reflect adapted path

## Phase 5: Gap Analysis and Documentation

### Missing Implementation Analysis

#### Critical Missing Components:
1. **AICurriculumEngine Service**
   - File should exist: `server/src/services/aiCurriculumEngine.ts`
   - Currently: All responses are stubbed in AIOrchestrator
   - Impact: No real AI-powered curriculum generation

2. **LearningAnalytics Service**
   - File should exist: `server/src/services/learningAnalytics.ts`
   - Currently: No analytics calculations
   - Impact: No performance trend analysis

3. **Database Integration**
   - Expected: Curriculum data persistence
   - Currently: No database storage
   - Impact: No learning path storage or user progress tracking

4. **Real AI Integration**
   - Expected: Actual OpenAI API calls with curriculum prompts
   - Currently: Mock responses only
   - Impact: No intelligent curriculum generation

#### Recommendations for Implementation:
1. **Priority 1**: Implement AICurriculumEngine service with real AI integration
2. **Priority 2**: Add database schema and persistence layer
3. **Priority 3**: Implement LearningAnalytics service
4. **Priority 4**: Add comprehensive error handling and retry logic

## Test Execution Results Template

```markdown
## Test Execution Results

**Date**: [DATE]
**Executed By**: [NAME/AGENT]
**Environment**: [DEVELOPMENT/STAGING]

### Phase 2A Results: ✅❌⚠️
- Test 1.1 (Valid daily plan): [RESULT]
- Test 1.2 (Invalid request): [RESULT]
- Test 1.3 (Auth required): [RESULT]
- Test 2.1 (Poor performance): [RESULT]
- Test 2.2 (Excellent progress): [RESULT]
- Test 3.1 (Retrieve plan): [RESULT]
- Test 4.1 (Short time): [RESULT]
- Test 4.2 (Long time): [RESULT]

### Phase 2B Results: ✅❌⚠️
- Test 5 (Pronunciation): [RESULT]
- Test 6 (Grade response): [RESULT] 
- Test 7 (Generate lesson): [RESULT]

### Phase 3 Results: ✅❌⚠️
- Test 8.1 (Initial render): [RESULT]
- Test 8.2 (Dashboard components): [RESULT]
- Test 8.3 (Hook integration): [RESULT]

### Phase 4 Results: ✅❌⚠️
- Test 9 (Daily plan workflow): [RESULT]
- Test 10 (Adaptation workflow): [RESULT]

### Critical Issues Found:
1. [ISSUE DESCRIPTION]
2. [ISSUE DESCRIPTION]

### Recommendations:
1. [RECOMMENDATION]
2. [RECOMMENDATION]
```

## Authentication Notes

**Important**: The current implementation requires authentication. For testing, you may need to:
1. Register a user account at http://localhost:5175/register
2. Login and extract the JWT token from browser dev tools
3. Use the token in API requests: `Authorization: Bearer [TOKEN]`

Alternatively, you may need to temporarily modify the authentication middleware for testing purposes.

## Conclusion

This methodology provides a comprehensive testing framework for the AI curriculum features. The implementation is architecturally sound with proper type safety, validation, and error handling. The main limitation is the use of intelligent stubs instead of real AI integration, but this allows for thorough testing of the integration patterns and API contracts.

The testing approach follows the established component testing methodology while adding API-specific verification steps. All test cases are designed to validate both the happy path and error scenarios, ensuring robust system behavior.