# App Overhaul Implementation Plan

This document provides a high-level overview of the project's phases and major tasks. It serves as a central hub for tracking progress.

## Quick Links
- [System Architecture](./architecture/system_architecture.mermaid)
- [Database Schema](./architecture/database_schema.mermaid)
- [Product Requirements Document (PRD)](./language_learning_prd.md)
- [Future Implementation Considerations](./future_implementation_considerations.md)

---

## PHASE 1: FOUNDATION

### Status: Completed

| Task ID | Description                                  | Status      | Details                               |
| :------ | :------------------------------------------- | :---------- | :------------------------------------ |
| P0      | Seed Initial Learning Units and Lessons      | `[x]` Done  | [details](./tasks/phase-2/P0-seed-data.md) |
| P1      | Update DB Schema for Lesson Progress         | `[x]` Done  | [details](./tasks/phase-2/P1-lesson-progress-schema.md) |
| P2      | Implement Backend APIs for Learning Paths    | `[x]` Done  | [details](./tasks/phase-2/P2-backend-api.md) |
| 1.1     | Install Dependencies                         | `[x]` Done  | [details](./tasks/phase-1/1-1-dependencies.md) |
| 1.2     | Create Design System                         | `[x]` Done  | [details](./tasks/phase-1/1-2-design-system.md) |
| 1.3     | Create Bottom Tab Navigation                 | `[x]` Done  | [details](./tasks/phase-1/1-3-bottom-nav.md) |
| 1.4     | Create Main Layout Component                 | `[x]` Done  | [details](./tasks/phase-1/1-4-main-layout.md) |
| 1.5     | Create Base Page Components                  | `[x]` Done  | [details](./tasks/phase-1/1-5-base-pages.md) |
| 1.6     | Update Routing                               | `[x]` Done  | [details](./tasks/phase-1/1-6-routing.md) |
| 2.1     | Database Schema Updates                      | `[x]` Done  | [details](./tasks/phase-1/2-1-db-schema.md) |
| 2.2     | Create Data Models                           | `[x]` Done  | [details](./tasks/phase-1/2-2-data-models.md) |
| 2.3.1   | Enhance Progress Controller & Service            | `[x]` Done  | [details](./tasks/phase-1/2-3-1-progress-ctrl.md) |
| 2.3.2   | Create Gamification Controller & Services        | `[x]` Done  | [details](./tasks/phase-1/2-3-2-gamify-ctrl.md)   |
| 2.3.3   | Create AI Controller & Service                   | `[x]` Done  | [details](./tasks/phase-1/2-3-3-ai-ctrl.md)       |
| 2.3.4   | Create Speech Controller & Service               | `[x]` Done  | [details](./tasks/phase-1/2-3-4-speech-ctrl.md)   |
| 2.4     | Create Progress Service                      | `[x]` Done  | [details](./tasks/phase-1/2-4-progress-service.md) |
| 2.5     | Update API Routes                            | `[x]` Done  | [details](./tasks/phase-1/2-5-api-routes.md) |

---

## PHASE 2: CORE LEARNING FEATURES

### Status: In Progress

| Task ID | Description                                  | Status      | Details                               |
| :------ | :------------------------------------------- | :---------- | :------------------------------------ |
| 2.1     | Implement Visual Learning Path Component     | `[x]` Done  | [details](./tasks/phase-2/2-1-visual-learning-path.md) |
| 2.2     | Integrate Authentication with New Layout     | `[x]` Done  | [details](./tasks/phase-2/2-2-auth-integration.md) |
| 2.3.1   | **Backend**: Enhance Service to Compute Dynamic Lesson Status | `[x]` Done | [details](./tasks/phase-2/2-3-1-dynamic-status-service.md) |
| 2.3.2   | **Backend**: Implement `start` and `complete` Lesson Endpoints | `[x]` Done | [details](./tasks/phase-2/2-3-2-lesson-endpoints.md) |
| 2.3.3   | **Frontend**: Update `LessonNode` to Visually Reflect Status | `[x]` Done | [details](./tasks/phase-2/2-3-3-lesson-node-ui.md) |
| 2.3.4   | **Frontend**: Implement `start` and `complete` Logic on `LessonPage` | `[x]` Done | [details](./tasks/phase-2/2-3-4-lesson-page-logic.md) |
| 2.4.1   | **Frontend**: Create Foundation for Dynamic Content Components | `[x]` Done | [details](./tasks/phase-2/2-4-1-dynamic-content-foundation.md) |
| 2.4.2   | **Frontend**: Implement Dynamic Component Loading in `LessonPage` | `[x]` Done | [details](./tasks/phase-2/2-4-2-dynamic-loading.md) |
| 2.4.2.1 | **Frontend**: Create `DynamicLessonContent` Component | `[x]` Done | Refactor rendering logic into dedicated component |
| 2.4.2.2 | **Frontend**: Refactor `LessonPage.tsx` to Use New Component | `[x]` Done | Simplify page by delegating to `DynamicLessonContent` |
| 2.4.2.3 | **Frontend**: Install Zod and Create Content Schemas | `[x]` Done | Add runtime validation for lesson content data |
| 2.4.2.4 | **Frontend**: Integrate Zod Validation in Dynamic Loading | `[x]` Done | Validate content data before rendering components |
| 2.4.3   | **Frontend**: Create Placeholder Content Components (`Vocab`, `Grammar`, etc.) | `[x]` Done | [details](./tasks/phase-2/2-4-3-placeholder-components.md) |
| 2.4.4   | **Docs**: Update High-Level Architecture Diagrams | `[x]` Done | [details](./tasks/phase-2/2-4-4-update-architecture-docs.md) |
