# SUBTASK 03: GET Endpoint Validation Enhancement

## Issue Summary
**High Priority Issue**: GET endpoints in AI controller incorrectly attempt to validate `req.body`, causing 400 validation errors. GET requests typically don't have request bodies, but the `handleAIRequest` function validates `req.body` for ALL HTTP methods, causing frontend dashboard failures.

## Impact Assessment
- **Severity**: HIGH PRIORITY - Breaks AI dashboard functionality
- **Affected Endpoints**: 
  - `GET /api/v1/ai/dashboard/daily-plan`
  - `GET /api/v1/ai/curriculum/daily-plan/:userId`
  - `GET /api/v1/ai/curriculum/learning-recommendations/:userId`
- **Error Pattern**: `400 Bad Request - Validation failed`
- **User Impact**: AI Dashboard shows empty/error states, no personalized content
- **System Impact**: 50% of AI endpoints non-functional

## Root Cause Analysis
Current `handleAIRequest` function in `server/src/controllers/aiController.ts` validates `req.body` regardless of HTTP method:

```typescript
// PROBLEMATIC: Always validates req.body, even for GET requests
const validationResult = validateAIPayload(taskType, req.body);
```

**Issues**:
1. GET requests typically have empty or undefined `req.body`
2. Validation schemas expect specific data structure
3. Validation fails before AI processing begins
4. No conditional logic for different HTTP methods

## Development Principles Compliance
Following `docs/development_docs/development_principles.md`:
- ✅ **Maximize Code Reuse**: Enhance existing `handleAIRequest` rather than duplicate
- ✅ **Factory Pattern**: Continue using `aiServiceFactory`
- ✅ **Performance**: Avoid creating separate handlers (anti-pattern)
- ✅ **Type Safety**: Use existing Zod validation schemas

## Files Requiring Updates

### Primary File: server/src/controllers/aiController.ts

**Current Problematic Implementation**:
```typescript
const handleAIRequest = (taskType: string) => {
  return async (req: Request, res: Response) => {
    try {
      // PROBLEM: Always validates req.body regardless of HTTP method
      const validationResult = validateAIPayload(taskType, req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error?.issues || []
        });
      }

      const result = await aiServiceFactory.processAITask(taskType, validationResult.data, req.user);
      res.json(result);
      
    } catch (error) {
      console.error(`Error in ${taskType}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
```

**Enhanced Implementation (RECOMMENDED)**:
```typescript
const handleAIRequest = (taskType: string) => {
  return async (req: Request, res: Response) => {
    try {
      let validationResult;
      let payload;
      
      // Conditional validation based on HTTP method
      if (req.method === 'GET') {
        // For GET requests, combine params and query for validation
        payload = {
          ...req.params,
          ...req.query,
          userId: req.user?.userId || parseInt(req.params.userId) || req.user.userId
        };
        
        // Convert string parameters to appropriate types
        if (payload.userId && typeof payload.userId === 'string') {
          payload.userId = parseInt(payload.userId);
        }
        
        validationResult = validateAIPayload(taskType, payload);
      } else {
        // For POST/PUT/PATCH requests, validate body as before
        payload = req.body;
        validationResult = validateAIPayload(taskType, payload);
      }

      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error?.issues || [],
          method: req.method,
          receivedData: payload // helpful for debugging
        });
      }

      // Process AI task with validated data
      const result = await aiServiceFactory.processAITask(
        taskType, 
        validationResult.data, 
        req.user
      );
      
      res.json(result);
      
    } catch (error) {
      console.error(`Error in ${taskType}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
```

## Implementation Strategy

### Code Reuse Analysis
**✅ Excellent Code Reuse Benefits**:
1. **Single Function**: Maintains one `handleAIRequest` function for all AI endpoints
2. **Factory Pattern**: Continues using `aiServiceFactory.processAITask()`
3. **Consistent Error Handling**: Same error response format across all endpoints
4. **Validation Schemas**: Reuses existing Zod schemas from `ai.validators.ts`
5. **Middleware Chain**: No changes to authentication/authorization flow

### Alternative Implementation Approaches

#### Approach 1: Enhanced handleAIRequest (RECOMMENDED)
**Pros**:
- ✅ 100% code reuse - single function handles all methods
- ✅ Maintains factory pattern compliance
- ✅ Consistent error handling across endpoints
- ✅ No duplicate code or logic
- ✅ Type-safe with existing Zod schemas

**Cons**:
- Slightly more complex conditional logic
- Need to ensure param/query type conversion

#### Approach 2: Separate GET/POST Handlers (NOT RECOMMENDED)
```typescript
// Anti-pattern - violates development principles
const handleAIGetRequest = (taskType: string) => { /* GET logic */ };
const handleAIPostRequest = (taskType: string) => { /* POST logic */ };
```

**Pros**:
- Simpler individual functions

**Cons**:
- ❌ Violates "maximize code reuse" principle
- ❌ Duplicate error handling logic
- ❌ Separate validation paths
- ❌ More code to maintain
- ❌ Performance anti-pattern (duplicate functions)

#### Approach 3: Middleware-Based Validation
```typescript
// Add validation middleware before handleAIRequest
const validateByMethod = (taskType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validation logic here
    next();
  };
};
```

**Pros**:
- Separation of concerns
- Reusable validation middleware

**Cons**:
- More complex middleware chain
- Harder to debug validation issues
- Additional function calls (performance)

## Dependencies and Integration Points

### Validation Schema Dependencies
**File**: `server/src/controllers/ai.validators.ts`

Expected schemas that need to support both body and param/query validation:
```typescript
// Must work with both req.body AND req.params + req.query
export const dailyPlanSchema = z.object({
  userId: z.coerce.number().positive(),
  // ... other fields
});

export const learningRecommendationsSchema = z.object({
  userId: z.coerce.number().positive(), 
  // ... other fields
});
```

**Key Point**: `z.coerce.number()` is crucial for converting string params to numbers.

### Route Configuration
**File**: `server/src/routes/ai.routes.ts` (expected location)

Current route configuration likely:
```typescript
// These routes need to work after the fix
router.get('/dashboard/daily-plan', handleAIRequest('generateDailyPlan'));
router.get('/curriculum/daily-plan/:userId', handleAIRequest('getDailyPlan'));
router.get('/curriculum/learning-recommendations/:userId', handleAIRequest('getLearningRecommendations'));

// POST routes should continue working
router.post('/curriculum/daily-plan', handleAIRequest('generateDailyPlan'));
router.post('/curriculum/adapt-path', handleAIRequest('adaptLearningPath'));
```

## Testing Strategy

### Unit Tests for Enhanced Function
```javascript
describe('Enhanced handleAIRequest', () => {
  describe('GET requests', () => {
    it('should validate params and query for GET requests', async () => {
      const req = {
        method: 'GET',
        params: { userId: '123' },
        query: {},
        user: { userId: 123 }
      };
      
      const handler = handleAIRequest('getDailyPlan');
      await handler(req, res);
      
      expect(res.status).not.toHaveBeenCalledWith(400);
    });
    
    it('should convert string userId to number', async () => {
      const req = {
        method: 'GET',
        params: { userId: '123' },
        query: {},
        user: { userId: 123 }
      };
      
      // Test that validation passes with string->number conversion
      const handler = handleAIRequest('getDailyPlan');
      await handler(req, res);
      
      expect(aiServiceFactory.processAITask).toHaveBeenCalledWith(
        'getDailyPlan',
        expect.objectContaining({ userId: 123 }), // number, not string
        req.user
      );
    });
  });
  
  describe('POST requests', () => {
    it('should validate body for POST requests', async () => {
      const req = {
        method: 'POST',
        body: { userId: 123, preferences: {} },
        user: { userId: 123 }
      };
      
      const handler = handleAIRequest('generateDailyPlan');
      await handler(req, res);
      
      expect(res.status).not.toHaveBeenCalledWith(400);
    });
  });
});
```

### Integration Testing
```bash
# Test GET endpoints after fix
curl -X GET "http://localhost:3001/api/v1/ai/dashboard/daily-plan" \
  -H "Authorization: Bearer $JWT_TOKEN"

curl -X GET "http://localhost:3001/api/v1/ai/curriculum/daily-plan/123" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Test POST endpoints still work
curl -X POST "http://localhost:3001/api/v1/ai/curriculum/daily-plan" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": 123, "preferences": {}}'
```

## Edge Cases and Error Handling

### Parameter Type Conversion
```typescript
// Handle various parameter formats
const convertUserId = (value: any): number | undefined => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

// Usage in enhanced function:
payload.userId = convertUserId(payload.userId) || req.user?.userId;
```

### Missing Authentication
```typescript
// Handle cases where req.user might be undefined
if (!req.user && !payload.userId) {
  return res.status(401).json({
    error: 'Authentication required',
    message: 'User ID not found in token or parameters'
  });
}
```

### Validation Error Enhancement
```typescript
if (!validationResult.success) {
  return res.status(400).json({
    error: 'Validation failed',
    details: validationResult.error?.issues || [],
    method: req.method,
    taskType: taskType,
    receivedData: process.env.NODE_ENV === 'development' ? payload : undefined
  });
}
```

## Performance Considerations

### Memory Efficiency
- ✅ No duplicate handler functions
- ✅ Single validation path per request
- ✅ Reuse existing factory services

### Request Processing
- ✅ Minimal overhead for method checking
- ✅ No additional middleware layers
- ✅ Same number of function calls as before

### Caching Implications
- GET endpoints should leverage existing cache mechanisms
- No changes needed to `CacheService` integration
- Response caching remains unchanged

## Success Criteria
- ✅ All GET AI endpoints return 200 status codes (not 400)
- ✅ POST endpoints continue working unchanged
- ✅ Frontend AI Dashboard loads data successfully
- ✅ Parameter validation works for GET requests
- ✅ Body validation works for POST requests
- ✅ Maintains single `handleAIRequest` function
- ✅ No duplicate code or handlers created
- ✅ Error responses remain consistent

## Risk Assessment

### Low Risk:
- Conditional logic is straightforward
- Existing validation schemas work for both use cases
- No breaking changes to working POST endpoints

### Medium Risk:
- Parameter type conversion needs careful handling
- Must ensure all route parameters are captured
- Authentication integration points

### Mitigation Strategies:
- Test both GET and POST endpoints thoroughly
- Validate parameter type conversion with various inputs
- Ensure authentication middleware compatibility
- Monitor error logs for validation failures

## Dependencies
- **Blocks**: None - can be implemented independently
- **Blocked By**: SUBTASK_01 (database fixes) should be completed first for full testing
- **Prerequisites**: Requires existing `validateAIPayload` and `aiServiceFactory`

## Documentation Updates Required
- Update API documentation to clarify GET vs POST parameter handling
- Document parameter type conversion behavior
- Update error response examples
- Include validation debugging information
