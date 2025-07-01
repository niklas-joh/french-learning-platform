# Task 3.1.A.6: AI Orchestration - API Layer Integration

## **Task Information**
- **Parent Task**: 3.1.A
- **Estimated Time**: 0.5 hours
- **Priority**: 🔥 Critical
- **Dependencies**: 3.1.A.5
- **Status**: ⏳ Not Started

## **Objective**
Expose the `AIOrchestrator`'s functionality to the rest of the application by creating a dedicated API layer. This involves creating a new controller and a new routes file to handle incoming HTTP requests for AI services.

## **Success Criteria**
- [ ] A new `server/src/controllers/aiController.ts` file is created.
- [ ] The `aiController` instantiates and uses the `AIOrchestrator` service.
- [ ] A new `server/src/routes/aiRoutes.ts` file is created to define API endpoints like `POST /api/ai/generate-content`.
- [ ] The new AI routes are protected by the existing authentication middleware.
- [ ] The main `server/src/app.ts` is updated to register the new AI routes.

## **Implementation Details**

### **1. AI Controller (`aiController.ts`)**
This controller will act as the bridge between the HTTP layer and the AI service layer. It will parse request bodies, call the appropriate public method on the `AIOrchestrator`, and format the response to be sent back to the client.

### **2. AI Routes (`aiRoutes.ts`)**
This file will define all API endpoints related to AI. It will use the Express Router to map URLs to the corresponding controller methods. All routes will be protected to ensure only authenticated users can access AI features.

### **3. App Integration**
The main application file (`app.ts`) will be modified to import and use the new `aiRoutes`, making the endpoints live and accessible under the `/api/ai` path.

## **Files to Create/Modify**
- `server/src/controllers/aiController.ts` (Create)
- `server/src/routes/aiRoutes.ts` (Create)
- `server/src/app.ts` (Modify)

## **Validation**
1. Verify the new controller and routes files are created.
2. Check that `app.ts` is updated to include the AI routes.
3. After implementation, an API client (like Postman or Insomnia) can be used to send a test request to a new AI endpoint (e.g., `POST /api/ai/generate-content`) and receive a valid, albeit likely mocked, response.
4. The project should compile without errors.
