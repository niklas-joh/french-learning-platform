# Task 3.1.B.7: Fix and Complete the Generic AI Content Generation Endpoint

## **Task Information**
- **Task ID**: 3.1.B.7
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 1.5 hours
- **Priority**: 🔥 Critical
- **Dependencies**: Task 3.1.B.6 (Async Job Queue Workflow)
- **Status**: ⏳ Not Started

## **Objective**
Refactor the AI content generation API to make the `POST /api/ai/generate` endpoint truly generic. This involves updating the validation and controller logic to support all specified content types (`lesson`, `vocabulary_drill`, `grammar_exercise`, etc.), resolving the current limitation where only `type: 'lesson'` is accepted.

## **Success Criteria**
- [ ] The `POST /api/ai/generate` endpoint successfully accepts requests for all content types defined in the `contentGenerationRequestSchema`.
- [ ] The validation layer in `ai.validators.ts` uses a `discriminatedUnion` to correctly validate payloads based on the `type` field.
- [ ] The `generateContentAsync` function in `aiController.ts` is updated to use the new generic validator.
- [ ] The system can successfully create generation jobs for different content types like `grammar_exercise` and `vocabulary_drill`.
- [ ] All related documentation is updated to reflect the corrected, generic API design.

## **Implementation Details**

### **Problem Context**
Initial analysis revealed that the `POST /api/ai/generate` endpoint was not generic as intended. The validation logic was hardcoded to only accept `type: 'lesson'`, preventing the generation of other content types. This task corrects that implementation gap.

### **Step 1: Refactor the Validation Layer (`server/src/controllers/ai.validators.ts`)**
The core of this task is to create a flexible validation schema using Zod's `discriminatedUnion`. This will allow the system to apply different validation rules based on the `type` field in the request body.

**Action:** Replace the existing `generateLessonPayloadSchema` and update the `validationSchemaMap`.

```typescript
// server/src/controllers/ai.validators.ts

/**
 * Base schema for all content generation requests.
 * Contains common fields required for any content type.
 */
const contentRequestBaseSchema = z.object({
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  topics: z.array(z.string()).min(1, 'At least one topic is required.'),
  duration: z.number().int().min(1).max(60).optional(),
  focusAreas: z.array(z.string()).optional(),
  learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'mixed']).optional(),
});

/**
 * Schemas for each specific content type, extending the base.
 * Using discriminated union for type-safe validation based on the 'type' field.
 */
export const contentGenerationRequestSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('lesson') }).merge(contentRequestBaseSchema),
  z.object({ type: z.literal('vocabulary_drill') }).merge(contentRequestBaseSchema),
  z.object({ type: z.literal('grammar_exercise') }).merge(contentRequestBaseSchema),
  z.object({ type: z.literal('cultural_content') }).merge(contentRequestBaseSchema),
  z.object({ type: z.literal('personalized_exercise') }).merge(contentRequestBaseSchema),
]);


/**
 * Map of AI task types to their corresponding validation schemas
 * This provides a type-safe way to access validators based on task type
 */
export const validationSchemaMap = {
  GENERATE_CONTENT: contentGenerationRequestSchema, // New generic validator
  ASSESS_PRONUNCIATION: assessPronunciationPayloadSchema,
  GRADE_RESPONSE: gradeResponsePayloadSchema,
} as const;
```

### **Step 2: Update the Controller Logic (`server/src/controllers/aiController.ts`)**
Next, we must update the `generateContentAsync` function to use our new generic validator instead of the old, hardcoded one.

**Action:** Modify the `generateContentAsync` function.

```typescript
// server/src/controllers/aiController.ts

export const generateContentAsync = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  // Change from 'GENERATE_LESSON' to 'GENERATE_CONTENT'
  const validationResult = validateAIPayload('GENERATE_CONTENT', req.body); 
  
  if (!validationResult.success) {
    const errorResponse = formatValidationError(validationResult.error);
    res.status(400).json({
      message: errorResponse.message,
      details: errorResponse.details,
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  const contentRequest = {
    ...validationResult.data,
    userId: req.user!.userId,
  };

  try {
    const contentGenerator = contentGenerationServiceFactory.getDynamicContentGenerator();
    const { jobId } = await contentGenerator.generateContent(contentRequest);
    res.status(202).json({ jobId });
  } catch (error) {
    console.error(`[aiController] Failed to schedule job for user ${req.user!.userId}:`, error);
    res.status(500).json({ message: 'Failed to schedule content generation job.', code: 'JOB_SCHEDULE_FAILED' });
  }
};
```

### **Step 3: Final Documentation Update**
Once the implementation is fixed and verified, all relevant documentation must be updated to reflect the now fully functional generic endpoint.
- **`docs/api/content-generation-endpoints.yaml`**: Ensure it accurately describes the flexible `type` parameter and its enum values.
- **`docs/development_docs/tasks/phase-3_AI_integration/3-1-B-6-architecture-documentation.md`**: Update the API section to remove the incorrect specialized endpoints and describe the single, generic one.

## **Files to Modify**
- `server/src/controllers/ai.validators.ts`
- `server/src/controllers/aiController.ts`

## **Review Points**
1. **Validation Logic**: Confirm the `discriminatedUnion` works as expected for all content types.
2. **Controller Integration**: Ensure the controller correctly calls the new generic validator.
3. **API Behavior**: Test that requests with different valid `type` values are accepted and processed.
4. **Error Handling**: Verify that requests with invalid `type` values or incorrect payloads are rejected with a 400 error.

## **Testing Strategy**
- **Unit Tests**:
  - Add unit tests for the `contentGenerationRequestSchema` to verify it correctly validates and rejects different payloads.
  - Update unit tests for `generateContentAsync` to check the new validation path.
- **Integration Tests**:
  - Create integration tests that send `POST` requests to `/api/ai/generate` with different valid content types (`lesson`, `grammar_exercise`, etc.) and assert that a `202` status and a `jobId` are returned.
  - Create a test case with an invalid content type to ensure a `400` error is returned.
