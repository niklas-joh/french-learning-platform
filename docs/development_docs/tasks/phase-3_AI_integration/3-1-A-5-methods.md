# Task 3.1.A.5: AI Orchestration - Public Methods

## **Task Information**
- **Parent Task**: 3.1.A
- **Estimated Time**: 1 hour
- **Priority**: 🔥 Critical
- **Dependencies**: 3.1.A.4
- **Status**: ⏳ Not Started

## **Objective**
Implement the public-facing methods on the `AIOrchestrator` service. These methods will serve as the primary entry points for other parts of the application (like controllers) to request AI-powered functionality without needing to know the complex inner workings of the orchestration pipeline.

## **Success Criteria**
- [ ] Public methods (`generateContent`, `assessResponse`, etc.) are implemented on the `AIOrchestrator` class.
- [ ] Each public method correctly constructs the appropriate `AIRequest` object based on its arguments.
- [ ] Each public method calls the main `orchestrateRequest` pipeline to process the request.
- [ ] The methods provide a clean and intuitive API for the rest of the application to consume.

## **Implementation Details**
This subtask involves adding a layer of abstraction on top of the core `orchestrateRequest` pipeline.

### **Public Method Examples:**
- **`generateContent(userId: number, contentType: string, parameters: any): Promise<AIResponse>`**: For requesting new learning content.
- **`assessResponse(userId: number, userResponse: string, ...): Promise<AIResponse>`**: For grading a user's answer.
- **`generateCurriculumPlan(userId: number, ...): Promise<AIResponse>`**: For creating a new learning plan.
- **`conversationTurn(userId: number, ...): Promise<AIResponse>`**: For handling a turn in a conversation with the AI tutor.

Each of these methods will be responsible for creating a standardized `AIRequest` object and then passing it to `this.orchestrateRequest()` to be executed.

## **Files to Create/Modify**
- `server/src/services/aiOrchestrator.ts` (Modify)

## **Validation**
1. Review the `aiOrchestrator.ts` file to confirm the public methods are implemented.
2. Verify that each public method correctly constructs an `AIRequest` and calls the main orchestration pipeline.
3. The project should compile without errors.
