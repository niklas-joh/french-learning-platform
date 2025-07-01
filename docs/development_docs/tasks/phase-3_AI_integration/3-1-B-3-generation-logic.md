# Task 3.1.B.3: Implement Content Generation Logic

## **Task Information**
- **Task ID**: 3.1.B.3
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 2 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.2 (Refactor to Async Workflow)
- **Status**: ⏳ Not Started

## **Objective**
Implement the core logic for generating raw content from the AI, structuring it into the defined TypeScript types, and handling the validation/enhancement feedback loop.

## **Success Criteria**
- [ ] `generateRawContent` method is implemented to call the `AIOrchestrator`.
- [ ] `structureContent` method correctly parses the AI's raw output into strongly-typed objects.
- [ ] `adjustRequestFromValidation` method implements logic to modify requests based on feedback.
- [ ] Placeholder implementations for validators and enhancers are created.
- [ ] The service correctly handles the full generation lifecycle (generate, validate, enhance, structure).

## **Implementation Details**

### **1. Implement `generateRawContent`**
- This method will use the `PromptTemplateEngine` to build a detailed prompt based on the `ContentRequest`, `ContentTemplate`, and `LearningContext`.
- It will then call the `aiOrchestrator.generateText` method to get the raw, unstructured content from the AI model.

### **2. Implement `structureContent`**
- This method will take the raw string or JSON output from the AI.
- It will parse this output and map it to the appropriate `StructuredContent` interface (e.g., `IStructuredLesson`).
- This step will include robust error handling for cases where the AI output does not match the expected format.

### **3. Implement `adjustRequestFromValidation`**
- This method will contain the logic for the self-correction loop.
- Based on the `issues` in the `ContentValidation` object, it will modify the `ContentRequest` to guide the AI toward a better result on the next attempt. For example, if validation failed because of "too complex vocabulary", it might add a constraint to the request.

### **4. Create Mock/Placeholder Services**
- To allow for testing of the `DynamicContentGenerator`, simple placeholder implementations of the factory-created services (`IContentValidator`, `IContentEnhancer`) will be created.
- These mocks will return predictable results (e.g., a validator that always returns `isValid: true`).

## **Files to Create/Modify**
- `server/src/services/contentGeneration/DynamicContentGenerator.ts` (Modify)
- `server/src/services/contentGeneration/validators/` (New folder and placeholder files)
- `server/src/services/contentGeneration/enhancers/` (New folder and placeholder files)

## **Next Steps**
After completion, proceed to Task 3.1.B.4 (Database Schema for AI Content).
