# Future Implementation Considerations

This document tracks architectural improvements, refactoring opportunities, and larger-scale changes that have been identified but are outside the scope of immediate tasks.

## 1. Adopt TanStack Query for Server State Management
- **Identified**: During the implementation of the Learning Path feature (Phase 2).
- **Current State**: We are using basic custom React hooks (`useLearningPath`) for data fetching.
- **Problem**: Our custom hooks are functional but lack caching, automatic refetching on window focus, request deduplication, and other crucial performance optimizations. This leads to redundant API calls and a less responsive user experience.
- **Proposed Solution**: Adopt a dedicated server-state management library like TanStack Query (formerly React Query).
- **Benefits**:
  - Centralize all data fetching logic.
  - Reduce boilerplate code significantly.
  - Improve application performance and responsiveness out-of-the-box.
  - Provide a better user experience with features like stale-while-revalidate.

## 2. Implement API Pagination for Large Data Sets
- **Identified**: During the implementation of the Learning Path feature (Phase 2).
- **Current State**: The `/api/learning-paths/:pathId/user-view` endpoint fetches the entire learning path, including all units and lessons, in a single request.
- **Problem**: For large learning paths (e.g., 50+ lessons), this can result in a very large JSON payload, increasing initial load times and memory usage.
- **Proposed Solution**: Refactor the backend API to support pagination or per-unit fetching. The client would initially fetch the list of units, and then fetch the lessons for each unit as it becomes visible.
- **Benefits**:
  - Drastically reduces initial payload size.
  - Improves perceived performance, as the user sees the first part of the path much faster.
  - Reduces server load.

## 3. Virtualize Long Lists for Performance
- **Identified**: During the implementation of the Learning Path feature (Phase 2).
- **Current State**: The `LearningPath.tsx` component maps over all units and renders them directly.
- **Problem**: Rendering a large number of DOM nodes (e.g., for a path with 20+ units and 100+ lessons) can cause performance issues, especially on mobile devices.
- **Proposed Solution**: Implement a list virtualization library like `react-window` or `react-virtual` for the learning path view.
- **Benefits**:
  - Ensures high performance regardless of the number of lessons by only rendering the items currently in the viewport.
  - Keeps the UI smooth and responsive.

## 4. Dynamic `pathId` Selection
- **Identified**: During the implementation of the Learning Path feature (Phase 2).
- **Current State**: The `pathId` is hardcoded to `1` in `LessonsPage.tsx`.
- **Problem**: The user cannot switch between different learning paths (e.g., "French for Beginners" vs. "Business French").
- **Proposed Solution**:
  1. Create a new API endpoint to list all available learning paths.
  2. Implement a UI element (e.g., a dropdown or a selection page) that allows the user to choose a learning path.
  3. Store the selected `pathId` in global state or as a URL parameter and pass it dynamically to the `LearningPath` component.

## 5. Evolve Global State Management
- **Identified**: During the planning phase for authentication integration (Task 2.2).
- **Current State**: We are implementing a dedicated `AuthContext` for managing user authentication state.
- **Problem**: As the application grows, we may need to manage more global state (e.g., UI state, notifications, user preferences). Adding a new React Context for each piece of global state can lead to deeply nested providers in `App.tsx` (often called "Provider Hell"), which can be cumbersome to maintain.
- **Proposed Solution**: If the application's global state needs expand beyond authentication and one or two other simple states, we should consider migrating to a dedicated, lightweight state management library like **Zustand** or **Jotai**.
- **Benefits**:
  - Avoids the provider nesting issue.
  - Simplifies state access in components.
  - Offers powerful features (like derived state and middleware) with minimal boilerplate compared to Redux.
  - Provides a clear, centralized store for all global state.

## 6. Robust Prerequisite System for Learning Paths
- **Identified**: During the implementation of the dynamic learning path (Task 2.3).
- **Current State**: The backend `learningPathService` assumes a strictly linear path, unlocking the next lesson in sequence. The `prerequisites` field on the `learning_units` table is not currently used by the logic.
- **Problem**: This prevents the creation of non-linear learning paths where, for example, a user might need to complete two specific "beginner" units before unlocking an "intermediate" one. The current system cannot model these dependencies.
- **Proposed Solution**:
  1.  **Schema Refinement**: Formalize the `prerequisites` column in the `learning_units` table to store a structured format, such as a JSON array of required `unit_id`s (e.g., `[1, 3]`).
  2.  **Backend Logic Enhancement**: Update the `getLearningPathUserView` service to:
      a. Fetch completion status for all units for the user.
      b. For each unit, parse its prerequisites.
      c. A unit (and its first lesson) becomes `available` only if all its prerequisite units are marked as `completed`.
- **Benefits**:
  - Enables the creation of flexible and pedagogically sound learning curricula.
  - Allows for branching paths and optional review units.
  - Makes the learning structure much more powerful and future-proof.

## 7. Transition to an Asynchronous Event-Driven Architecture for User Activities
- **Identified**: During the planning for API controller creation (Phase 1).
- **Current State**: The `POST /api/user/activity-completed` endpoint synchronously handles progress updates, XP calculations, and achievement checks within a single database transaction.
- **Problem**: While transactional integrity is good, this approach can lead to increased API response times as more logic (e.g., analytics hooks, social notifications) is added to the flow. It tightly couples the core services.
- **Proposed Solution**: Refactor the system to be event-driven.
  1.  The `progressController`'s only job would be to validate the input and publish an `ActivityCompleted` event to a message queue (like RabbitMQ or a simple in-memory queue for starters).
  2.  Multiple, independent consumer services (e.g., `ProgressConsumer`, `AchievementConsumer`, `AnalyticsConsumer`) would listen for this event and process it asynchronously.
- **Benefits**:
  - **Decoupling**: Services no longer need to know about each other.
  - **Performance**: The API response to the user becomes nearly instantaneous.
  - **Scalability & Resilience**: Each consumer can be scaled independently. A failure in the achievement consumer doesn't affect progress updates.

## 8. Implement Runtime Schema Validation for Lesson Content
- **Identified**: During planning for dynamic lesson content rendering (Task 2.4).
- **Current State**: The frontend relies on TypeScript interfaces to trust the shape of the `lesson.content_data` JSON blob coming from the API.
- **Problem**: There is no runtime guarantee that the data from the database actually conforms to these frontend types. A data entry error or a migration issue could lead to malformed JSON, causing runtime crashes on the client.
- **Proposed Solution**: Introduce a schema validation library like **Zod**.
  1.  **Backend**: Before sending lesson data, parse the `content_data` JSON using a Zod schema to ensure it's valid.
  2.  **Frontend**: When receiving data from the API, parse it with the same Zod schema. This not only validates the data but also automatically infers the TypeScript types, eliminating the need to maintain separate `interface` definitions.
- **Benefits**:
  - Creates a single source of truth for data shapes (the Zod schema).
  - Prevents malformed data from ever reaching the UI components.
  - Makes the application significantly more robust and resilient to data integrity issues.

## 9. Automate `schema.sql` Generation
- **Identified**: During planning for the `camelCase` migration (Phase 1).
- **Current State**: The `database/schema.sql` file is a manually maintained or infrequently generated snapshot of the database schema.
- **Problem**: This file can easily become outdated as new migrations are applied. An out-of-sync schema file provides a false sense of documentation and can mislead developers. The migrations themselves are the only true source of truth.
- **Proposed Solution**: Implement a script in `package.json` (e.g., `npm run db:schema:dump`) that uses the underlying database's CLI tools to dump the current schema after all migrations have been run. This script should be run as part of the development workflow to ensure the `schema.sql` file is always up-to-date.
- **Benefits**:
  - Ensures architectural documentation is always accurate.
  - Provides a reliable, quick reference for the current database structure without needing to inspect all migration files.
  - Improves developer onboarding and confidence.
