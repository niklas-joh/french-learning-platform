# Task 2.3: Implement Dynamic Learning Path & Lesson Progression

-   **Objective**: Transition the visual learning path from static data to a dynamic, user-specific view. Implement the core logic for lesson progression, where completing one lesson unlocks the next.

-   **[ ] Subtask 2.3.A: Refactor Backend Service for User-Specific View**
    -   **Objective**: Enhance `learningPathService.ts` on the server to merge learning path data with user progress.
    -   **Action**:
        1.  In `server/src/services/learningPathService.ts`, fully implement the `getLearningPathUserView(pathId, userId)` method.
        2.  The method will fetch the path, its units, and all associated lessons.
        3.  It will then perform a `LEFT JOIN` against the `user_lesson_progress` table for the given `userId`.
        4.  A new `status` property will be calculated and added to each lesson object. The logic will be:
            *   If a status exists in `user_lesson_progress`, use it (e.g., 'completed').
            *   If not, determine if the lesson is `available` (it's the first uncompleted lesson) or `locked`.
        5.  Ensure the final data structure is clean and matches the `ClientLearningPath` type expected by the frontend.
    -   **Impacted Files**: `server/src/services/learningPathService.ts`.

-   **[ ] Subtask 2.3.B: Refactor Frontend Service and Hook**
    -   **Objective**: Update the client-side data fetching logic to consume the new user-specific endpoint.
    -   **Action**:
        1.  In `client/src/services/learningPathService.ts`, modify the `fetchLearningPath` function to call the `GET /api/learning-paths/1/user-view` endpoint. (We will hardcode the path ID to '1' for the main "French for Beginners" path for now).
        2.  In `client/src/hooks/useLearningPath.ts`, ensure it calls the updated service function and correctly manages the new data structure, including the `status` field for each lesson.
    -   **Impacted Files**: `client/src/services/learningPathService.ts`, `client/src/hooks/useLearningPath.ts`.

-   **[ ] Subtask 2.3.C: Update `LessonNode` Component for Dynamic Status**
    -   **Objective**: Make the `LessonNode` component visually represent the lesson's status (`locked`, `available`, `completed`).
    -   **Action**:
        1.  In `client/src/components/learning/LessonNode.tsx`, use the `status` prop to conditionally apply styles and icons.
        2.  **Locked**: Greyed out, non-interactive, perhaps with a `Lock` icon.
        3.  **Available**: Highlighted with the primary theme color, interactive, and shows a "start" icon (e.g., `PlayArrow`).
        4.  **Completed**: Styled distinctly (e.g., a filled-in look with reduced opacity) and shows a "completed" icon (e.g., `CheckCircle`).
        5.  The `onClick` handler should only be active for `available` or `completed` lessons.
    -   **Impacted Files**: `client/src/components/learning/LessonNode.tsx`.

-   **[ ] Subtask 2.3.D: Create `LessonPage` and Implement Navigation**
    -   **Objective**: Create a placeholder page for individual lessons and implement the navigation to it.
    -   **Action**:
        1.  Create a new file `client/src/pages/LessonPage.tsx` containing a basic layout with a title indicating which lesson has been loaded (e.g., "Lesson: {lessonId}").
        2.  Update `client/src/App.tsx` to include a new route within the `MainLayout`: `<Route path="/lessons/:lessonId" element={<LessonPage />} />`.
        3.  In `LessonNode.tsx`, when an `available` lesson is clicked, use the `useNavigate` hook to navigate the user to `/lessons/{lesson.id}`.
    -   **Impacted Files**: `client/src/pages/LessonPage.tsx` (New), `client/src/App.tsx`, `client/src/components/learning/LessonNode.tsx`.
