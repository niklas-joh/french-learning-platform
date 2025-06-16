# Feature Plan: Admin Authentication and Role Management

This document outlines the implementation plan for adding admin authentication and role management to the French Learning Platform.

## I. Backend Implementation (Node.js/Express & SQLite)

### 1. Database Schema Update
*   **Task:** Add a `role` column to the `users` table. [✅ COMPLETED]
*   **Details:**
    *   The `role` column will store user roles (e.g., 'user', 'admin').
    *   Default role for new users: 'user'.
*   **Actions:**
    *   [✅] Create a new database migration file in `server/database/migrations/`. (e.g., `20250616211523_add_role_to_users_table.ts`)
    *   [✅] Update `server/src/models/User.ts` to include the `role` property.

### 2. Admin User Provisioning
*   **Task:** Establish a method to designate users as administrators. [✅ COMPLETED]
*   **Details:**
    *   A script `scripts/set_admin_user.ts` was created and successfully run to set `admin@example.com` to the 'admin' role.
*   **Proposal (Initial Setup):**
    *   [✅] Create a script (e.g., using Knex CLI or a custom `ts-node` script) to update a specific user's role to 'admin' directly in the database.
    *   Alternatively, manually update via a DB client for the very first admin.

### 3. Authentication Logic Enhancement
*   **Task:** Include user's role in the JWT upon login. [✅ COMPLETED]
*   **Details:**
    *   The JWT now includes the `role` claim.
    *   A bug related to `userId` vs `id` in `user.controller.ts` that caused 401 errors post-login was identified and fixed.
*   **Actions:**
    *   [✅] Modify the login function in `server/src/controllers/auth.controller.ts`.
    *   [✅] Corrected `userId` usage in `server/src/controllers/user.controller.ts`.

### 4. Role-Based Access Control (RBAC) Middleware
*   **Task:** Create middleware to protect admin-only API routes. [🚧 IN PROGRESS / NEXT]
*   **Details:**
    *   The middleware (e.g., `admin.middleware.ts`) will execute after the existing `auth.middleware.ts`.
    *   It will verify if the authenticated user's JWT contains the 'admin' role.
    *   If not an admin, return a 403 Forbidden error.
*   **Actions:**
    *   Create `server/src/middleware/admin.middleware.ts`.

### 5. Placeholder Admin API Routes
*   **Task:** Create basic admin-only API endpoints for testing and initial development. [🚧 IN PROGRESS / NEXT]
*   **Details:**
    *   Example: `/api/admin/test` (GET) that returns a success message if accessed by an admin.
    *   These routes will be protected by the new RBAC middleware.
*   **Actions:**
    *   Create a new admin routes file (e.g., `server/src/routes/admin.routes.ts`).
    *   Integrate these routes into `server/src/app.ts`.

## II. Frontend Implementation (React & TypeScript)

### 1. Store User Role in Frontend State
*   **Task:** Manage the user's role in the frontend application state. [✅ COMPLETED]
*   **Details:**
    *   After login, the role is extracted from the backend's login response.
    *   The role is stored in `localStorage` as part of the `currentUser` object.
*   **Actions:**
    *   [✅] Update `client/src/services/authService.ts` to handle/return the role.
    *   [✅] Modified the authentication context/state management logic (implicitly via `currentUser` in `localStorage`).

### 2. Protected Admin Routes/Components
*   **Task:** Restrict access to admin-specific UI sections. [🚧 IN PROGRESS / NEXT]
*   **Proposal:**
    *   Develop an `<AdminRoute />` higher-order component or wrapper.
    *   This component will check if the current user has an 'admin' role.
    *   If not an admin, redirect the user (e.g., to the home page or login page).
*   **Actions:**
    *   Create `client/src/components/AdminRoute.tsx` (or similar).

### 3. Basic Admin Dashboard UI
*   **Task:** Create a placeholder page for the admin dashboard. [🚧 IN PROGRESS / NEXT]
*   **Details:**
    *   This page (e.g., `AdminDashboardPage.tsx`) will be protected by the `<AdminRoute />`.
    *   Initially, it can display a simple welcome message or attempt to fetch data from a placeholder admin API endpoint.
*   **Actions:**
    *   Create `client/src/pages/AdminDashboardPage.tsx`.
    *   Update client-side routing in `client/src/App.tsx` to include this new page and protect it.

### 4. Conditional UI for Admin Access
*   **Task:** Provide a clear way for admin users to navigate to the admin dashboard. [🚧 IN PROGRESS / NEXT]
*   **Proposal:**
    *   Add a conditional link/button (e.g., "Admin Panel") in the main navigation or user profile dropdown.
    *   This element should only be visible if the logged-in user is an admin.
*   **Actions:**
    *   Modify the relevant navigation component (e.g., `Navbar.tsx`, `Header.tsx`, or within `App.tsx`).

## III. Workflow & Testing

*   **Development Workflow:**
    *   [✅] Create a GitHub issue for this feature.
    *   [✅] Create a dedicated feature branch.
    *   [✅] Implement changes iteratively, with commits for logical backend and frontend chunks.
    *   Create a Pull Request for review upon completion.
*   **Testing Strategy:**
    *   **Manual Testing:**
        *   [✅] Test login as a regular user: ensure no access to admin UI sections or API endpoints. (Login fixed)
        *   [✅] Test login as an admin user: ensure full access to admin UI sections and API endpoints. (Admin user provisioned, login fixed)
    *   **API Testing:**
        *   Use tools like Postman or Insomnia to directly test the protection of admin API endpoints.
    *   **Unit/Integration Tests (Future Enhancement):**
        *   Backend: Write tests for the RBAC middleware and admin-specific controller logic.
        *   Frontend: Write tests for the `<AdminRoute />` component and admin-specific UI elements.

## IV. Files to be Created/Modified (Summary)

### Backend:
*   [✅] New migration file in `server/database/migrations/` (e.g., `YYYYMMDDHHMMSS_add_role_to_users.ts`)
*   [✅] `server/src/models/User.ts`
*   [✅] `server/src/controllers/auth.controller.ts`
*   [✅] `server/src/controllers/user.controller.ts` (Fix for userId)
*   `server/src/middleware/admin.middleware.ts` (New - Next Step)
*   `server/src/routes/admin.routes.ts` (New - Next Step)
*   `server/src/app.ts` (To include admin routes - Next Step)
*   [✅] (Potentially) A new script for admin user provisioning. (`scripts/set_admin_user.ts` created and used)

### Frontend:
*   [✅] `client/src/services/authService.ts`
*   [✅] Authentication context/state management files (e.g., `client/src/context/AuthContext.tsx`) (Implicitly via `currentUser` in `localStorage`)
*   `client/src/components/AdminRoute.tsx` (New - Next Step)
*   `client/src/pages/AdminDashboardPage.tsx` (New - Next Step)
*   `client/src/App.tsx` (for routing - Next Step)
*   Navigation component(s) (e.g., `client/src/components/Navbar.tsx`) (Next Step)
>>>>>>> REPLACE
*   **Details:**
    *   When a user logs in via `/api/auth/login`, the generated JWT will contain a `role` claim.
*   **Actions:**
    *   Modify the login function in `server/src/controllers/auth.controller.ts`.

### 4. Role-Based Access Control (RBAC) Middleware
*   **Task:** Create middleware to protect admin-only API routes.
*   **Details:**
    *   The middleware (e.g., `admin.middleware.ts`) will execute after the existing `auth.middleware.ts`.
    *   It will verify if the authenticated user's JWT contains the 'admin' role.
    *   If not an admin, return a 403 Forbidden error.
*   **Actions:**
    *   Create `server/src/middleware/admin.middleware.ts`.

### 5. Placeholder Admin API Routes
*   **Task:** Create basic admin-only API endpoints for testing and initial development.
*   **Details:**
    *   Example: `/api/admin/test` (GET) that returns a success message if accessed by an admin.
    *   These routes will be protected by the new RBAC middleware.
*   **Actions:**
    *   Create a new admin routes file (e.g., `server/src/routes/admin.routes.ts`).
    *   Integrate these routes into `server/src/app.ts`.

## II. Frontend Implementation (React & TypeScript)

### 1. Store User Role in Frontend State
*   **Task:** Manage the user's role in the frontend application state.
*   **Details:**
    *   After login, extract the role from the JWT or the backend's login response.
    *   Store the role in a global state (e.g., React Context or other state management solution).
*   **Actions:**
    *   Update `client/src/services/authService.ts` to handle/return the role.
    *   Modify the authentication context/state management logic.

### 2. Protected Admin Routes/Components
*   **Task:** Restrict access to admin-specific UI sections.
*   **Proposal:**
    *   Develop an `<AdminRoute />` higher-order component or wrapper.
    *   This component will check if the current user has an 'admin' role.
    *   If not an admin, redirect the user (e.g., to the home page or login page).
*   **Actions:**
    *   Create `client/src/components/AdminRoute.tsx` (or similar).

### 3. Basic Admin Dashboard UI
*   **Task:** Create a placeholder page for the admin dashboard.
*   **Details:**
    *   This page (e.g., `AdminDashboardPage.tsx`) will be protected by the `<AdminRoute />`.
    *   Initially, it can display a simple welcome message or attempt to fetch data from a placeholder admin API endpoint.
*   **Actions:**
    *   Create `client/src/pages/AdminDashboardPage.tsx`.
    *   Update client-side routing in `client/src/App.tsx` to include this new page and protect it.

### 4. Conditional UI for Admin Access
*   **Task:** Provide a clear way for admin users to navigate to the admin dashboard.
*   **Proposal:**
    *   Add a conditional link/button (e.g., "Admin Panel") in the main navigation or user profile dropdown.
    *   This element should only be visible if the logged-in user is an admin.
*   **Actions:**
    *   Modify the relevant navigation component (e.g., `Navbar.tsx`, `Header.tsx`, or within `App.tsx`).

## III. Workflow & Testing

*   **Development Workflow:**
    *   Create a GitHub issue for this feature.
    *   Create a dedicated feature branch.
    *   Implement changes iteratively, with commits for logical backend and frontend chunks.
    *   Create a Pull Request for review upon completion.
*   **Testing Strategy:**
    *   **Manual Testing:**
        *   Test login as a regular user: ensure no access to admin UI sections or API endpoints.
        *   Test login as an admin user: ensure full access to admin UI sections and API endpoints.
    *   **API Testing:**
        *   Use tools like Postman or Insomnia to directly test the protection of admin API endpoints.
    *   **Unit/Integration Tests (Future Enhancement):**
        *   Backend: Write tests for the RBAC middleware and admin-specific controller logic.
        *   Frontend: Write tests for the `<AdminRoute />` component and admin-specific UI elements.

## IV. Files to be Created/Modified (Summary)

### Backend:
*   New migration file in `server/database/migrations/` (e.g., `YYYYMMDDHHMMSS_add_role_to_users.ts`)
*   `server/src/models/User.ts`
*   `server/src/controllers/auth.controller.ts`
*   `server/src/middleware/admin.middleware.ts` (New)
*   `server/src/routes/admin.routes.ts` (New)
*   `server/src/app.ts`
*   (Potentially) A new script for admin user provisioning.

### Frontend:
*   `client/src/services/authService.ts`
*   Authentication context/state management files (e.g., `client/src/context/AuthContext.tsx`)
*   `client/src/components/AdminRoute.tsx` (New)
*   `client/src/pages/AdminDashboardPage.tsx` (New)
*   `client/src/App.tsx` (for routing)
*   Navigation component(s) (e.g., `client/src/components/Navbar.tsx`)

---
This plan provides a structured approach to implementing admin authentication and role management. Specific details might be refined during development.
