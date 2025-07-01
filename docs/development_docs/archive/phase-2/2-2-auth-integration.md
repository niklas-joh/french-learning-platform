# Task 2.2: Integrate Authentication with New Layout (Revised)

-   **Objective**: To implement a robust, performant, and centralized authentication system using React Context and global API interceptors, ensuring a seamless user experience and graceful handling of session expiry.

-   **[x] Subtask 2.2.A: Create Centralized API Service with Interceptors**
    -   **Objective**: To create a single Axios instance that globally handles both adding authentication tokens to requests and gracefully managing authentication errors from responses.
    -   **Action**: Create `client/src/services/api.ts`. This instance will have two interceptors:
        1.  **Request Interceptor**: Adds the `Authorization: Bearer <token>` header to all outgoing requests if a token exists.
        2.  **Response Interceptor**: Catches API responses. If a `401 Unauthorized` error is detected, it will trigger a global logout event and redirect the user to the login page. This centralizes session expiry logic.
    -   **Impacted Files**: `client/src/services/api.ts` (New), all other service files will be refactored to use this instance.

-   **[x] Subtask 2.2.B: Create Global Authentication Context**
    -   **Objective**: To establish a single source of truth for the user's authentication state that components can subscribe to.
    -   **Action**: Create `client/src/context/AuthContext.tsx`. It will manage `user`, `token`, and `isLoading` states. It will still attempt to fetch the user's profile on load to populate user data, but it will no longer be the primary mechanism for token validation. It will expose `login` and `logout` functions that can be used by components and the API interceptor.
    -   **Impacted Files**: `client/src/context/AuthContext.tsx` (New).

-   **[x] Subtask 2.2.C: Integrate AuthProvider and API Interceptors**
    -   **Objective**: To make the authentication context and the global error handling available to the entire application.
    -   **Action**: In `client/src/App.tsx`, wrap the application's routes within the `AuthProvider`. We will also ensure the API interceptors are properly initialized and have access to the `logout` functionality from the context.
    -   **Impacted Files**: `client/src/App.tsx`.

-   **[x] Subtask 2.2.D: Refactor ProtectedRoute and LoginPage**
    -   **Objective**: To connect the UI components to the new, robust authentication context.
    -   **Action**:
        1.  Modify `ProtectedRoute.tsx` to use the `useAuth` hook, checking `isLoading` and `user` states for routing decisions.
        2.  Modify `LoginPage.tsx` to use the `login` function from the `useAuth` hook and navigate to `/` on success.
    -   **Impacted Files**: `client/src/components/ProtectedRoute.tsx`, `client/src/pages/LoginPage.tsx`.

-   **[x] Subtask 2.2.E: Update High-Level Documentation**
    -   **Objective**: To ensure architectural documents reflect the new implementation and capture future considerations.
    -   **Action**:
        1.  Update `docs/development_docs/architecture/system_architecture.mermaid` to include "State Management (React Context)" and "API Interceptors".
        2.  Update `docs/development_docs/future_implementation_considerations.md` with a new section about adopting a more advanced global state manager if application complexity grows.
-   **Impacted Files**: `docs/development_docs/architecture/system_architecture.mermaid`, `docs/development_docs/future_implementation_considerations.md`.
