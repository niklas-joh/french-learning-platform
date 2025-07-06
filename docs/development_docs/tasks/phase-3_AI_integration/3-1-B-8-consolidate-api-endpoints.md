# Task 3.1.B.8: Consolidate AI API Endpoints

## **Task Information**
- **Task ID**: 3.1.B.8
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 1 hour
- **Priority**: Medium
- **Dependencies**: Task 3.1.B.7 (Fix Generic Generate Endpoint)
- **Status**: ✅ Completed

## **Objective**
Standardize the AI API by removing deprecated and redundant endpoint handlers from `aiController.ts`. This task implements the **API Endpoint Consolidation Strategy** (#44) by ensuring that specific, asynchronous endpoints are the single source of truth for AI actions, improving clarity, consistency, and maintainability.

## **Success Criteria**
- [ ] The deprecated `handleAIRequest` function is removed from `server/src/controllers/aiController.ts`.
- [ ] The associated `taskHandlerMap` is removed from `server/src/controllers/aiController.ts`.
- [ ] The deprecated controller functions (`generateLesson`, `assessPronunciation`, `gradeResponse`) that used `handleAIRequest` are removed.
- [ ] The API continues to function correctly, with `POST /api/ai/generate` being the primary endpoint for content generation.

## **Implementation Details**

### **Problem Context**
The `aiController.ts` contained a mix of new, asynchronous endpoint handlers (like `generateContentAsync`) and a deprecated, generic `handleAIRequest` function. This created two competing architectural patterns, leading to confusion and maintenance overhead. This task resolves the inconsistency by removing the deprecated code.

### **Step 1: Remove Deprecated Handlers from `aiController.ts`**
The core action is to delete the unused and deprecated code from the controller.

**Action:**
1.  Delete the `taskHandlerMap` constant.
2.  Delete the `handleAIRequest` function.
3.  Delete the `generateLesson`, `assessPronunciation`, and `gradeResponse` functions.

This leaves only the modern, asynchronous handlers (`generateContentAsync`, `listJobs`, `cancelJob`, `getGenerationStatus`, etc.), creating a clean and consistent API layer.

## **Files to Modify**
- `server/src/controllers/aiController.ts`

## **Review Points**
1. **Code Removal**: Confirm that all deprecated code related to `handleAIRequest` has been successfully removed.
2. **API Integrity**: Ensure that the removal of the old code does not negatively impact the functionality of the remaining, active endpoints.
3. **Architectural Consistency**: Verify that the controller now follows a single, consistent pattern for handling API requests.

## **Testing Strategy**
- **Regression Testing**:
  - Re-run the validation tests from Task 3.1.B.7 to ensure that the `POST /api/ai/generate` endpoint still functions as expected after the refactor.
  - Test the job management endpoints (`GET /api/ai/jobs`, `DELETE /api/ai/jobs/:jobId`, `GET /api/ai/generate/status/:jobId`) to confirm they were not affected.
