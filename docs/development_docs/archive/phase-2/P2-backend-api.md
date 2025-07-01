# Prerequisite Task P2: Implement Backend APIs for Learning Paths and Lesson Progress (Refined)

-   **Objective**: Create backend services, controllers, and routes to serve a consolidated learning path structure including user-specific lesson statuses.
-   **Key Actions**:
    1.  Create/Update Models: `server/src/models/UserLessonProgress.ts` (interface for the table).
    2.  Create Service: `server/src/services/learningPathService.ts`.
        *   Method `getLearningPathUserView(pathId: number, userId: number): Promise<LearningPathWithUserProgress>`. This method fetches the path, its units, and lessons. For each lesson, it joins with `user_lesson_progress` to get the user's status or defaults it (e.g., to 'locked', then 'available' if first/prerequisites met).
    3.  Create Controller: `server/src/controllers/learningPathController.ts`.
        *   Handler for `GET /api/learning-paths/:pathId/user-view` (or similar) that calls `learningPathService.getLearningPathUserView`.
    4.  Create Routes: `server/src/routes/learningPathRoutes.ts`.
    5.  Update `server/src/app.ts` to use new routes.
-   **Impacted Files**: New model, service, controller, routes files in `server/src/`; update `server/src/app.ts`, `docs/development_docs/architecture/system_architecture.mermaid`.
