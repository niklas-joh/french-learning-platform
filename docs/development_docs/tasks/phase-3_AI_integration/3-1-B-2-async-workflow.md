# Task 3.1.B.2: Refactor to Async Workflow

## **Task Information**
- **Task ID**: 3.1.B.2
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 2 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.1 (Initial Scaffolding & Type Definition)
- **Status**: ⏳ Not Started

## **Objective**
Refactor the content generation service to operate asynchronously. This is a critical architectural change to prevent API timeouts and improve user experience by providing immediate feedback while content is generated in the background.

## **Success Criteria**
- [ ] `generateContent` endpoint returns `202 Accepted` with a job ID.
- [ ] A message queue (e.g., using Redis and BullMQ) is implemented for job processing.
- [ ] A background worker service is created to process content generation jobs.
- [ ] A new endpoint is created to check the status of a generation job.
- [ ] The system remains robust and handles errors gracefully during background processing.

## **Implementation Details**

### **1. API Endpoint Modification**
- The `POST /api/ai/generate` endpoint in `aiController.ts` will be modified.
- Instead of awaiting the `DynamicContentGenerator.generateContent` method, it will enqueue a job and return a `202 Accepted` status with the `jobId`.

### **2. Job Queue Implementation**
- A job queue will be set up using a library like BullMQ with Redis.
- A new service, `ContentGenerationJobQueue`, will be created to abstract the queueing logic.

### **3. Background Worker**
- A new worker process will be created.
- This worker will listen for jobs on the content generation queue.
- It will instantiate the `DynamicContentGenerator` and call the `generateContent` method with the job payload.
- The result of the generation will be stored, likely in a cache or a new database table, associated with the `jobId`.

### **4. Status Check Endpoint**
- A new `GET /api/ai/generate/status/:jobId` endpoint will be created.
- This endpoint will check the status of the job (e.g., 'queued', 'processing', 'completed', 'failed') and return it to the client.
- If the job is 'completed', it will also return the final `GeneratedContent`.

## **Files to Create/Modify**
- `server/src/services/contentGeneration/ContentGenerationJobQueue.ts`
- `server/src/workers/contentGenerationWorker.ts`
- `server/src/controllers/aiController.ts` (Modify)
- `server/src/routes/ai.routes.ts` (Modify)

## **Next Steps**
After completion, proceed to Task 3.1.B.3 (Implement Content Generation Logic).
