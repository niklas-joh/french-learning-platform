# Task 3.1.A.4: AI Orchestration - Core Implementation

## **Task Information**
- **Parent Task**: 3.1.A
- **Estimated Time**: 2 hours
- **Priority**: 🔥 Critical
- **Dependencies**: 3.1.A.3
- **Status**: ✅ Completed

## **Objective**
Implement the core logic of the `AIOrchestrator` service. This includes the main `processAIRequest` method, which acts as the central pipeline for all AI-related requests, handling caching, rate limiting, context enhancement, and fallbacks.

## **Success Criteria**
- [x] The `AIOrchestrator` class is created in `server/src/services/ai/AIOrchestrator.ts`.
- [x] The constructor correctly accepts and stores its dependencies.
- [x] The main `processAIRequest` method is implemented with the full request lifecycle pipeline.
- [x] The implementation is generic and type-safe, handling different AI task types.
- [x] The code is well-documented and follows the refined architecture.
- [ ] The implementation uses `object-hash` for reliable cache key generation. - *Note: This was superseded by the internal `crypto`-based key generation in `CacheService`.*

## **Implementation Details**
This subtask brings together the supporting services created in the previous step into a cohesive workflow.

### **1. `AIOrchestrator` Class and Constructor**
The class will be designed to receive its dependencies (like `CacheService`, `RateLimitService`, etc.) through its constructor, adhering to the Dependency Injection pattern.

### **2. `orchestrateRequest` Pipeline**
This central method will execute the following steps in order:
1.  Check rate limits using `RateLimitService`.
2.  Check for a cached response using `CacheService`.
3.  If no cache hit, retrieve user context using `ContextService`.
4.  Enhance the request with the user context.
5.  Execute the actual AI request to the OpenAI API.
6.  Process and validate the AI's response.
7.  Cache the new response.
8.  Handle any errors gracefully using a fallback strategy.

### **3. Helper Methods**
Private methods like `checkRateLimit`, `checkCache`, `enhanceRequest`, `executeAIRequest`, `processResponse`, `cacheResponse`, and `handleFallback` will encapsulate the logic for each step of the pipeline, keeping the main `orchestrateRequest` method clean and readable.

## **Files to Create/Modify**
- `server/src/services/aiOrchestrator.ts` (Create)

## **Validation**
1. Verify the `AIOrchestrator.ts` file is created.
2. Review the code to ensure the `orchestrateRequest` method follows the defined pipeline logic.
3. Confirm that dependency injection is used correctly in the constructor.
4. The project should compile without errors.
