# CamelCase Migration Plan

This document outlines a staged approach for migrating the entire project from snake_case naming in the database and backend code to camelCase across the stack. Each phase lists the major directories and files that should be inspected and updated.

## Phase 1: Assessment and Preparation
- **Review database schema**: `database/schema.sql`, existing migration files in `database/migrations/`, and seed data in `database/seeds/`.
- **Catalogue impacted code**:
  - Backend source under `server/src/**` (models, controllers, routes, middleware, services, config).
  - Frontend source under `client/src/**` (components, pages, context, services, hooks, types).
- **Identify tests**: files in `server/src/**/__tests__/` and any client tests.
- **Plan migration strategy**: decide on naming conventions, create backup/rollback procedures, confirm PostgreSQL compatibility.

## Phase 2: Database Schema Migration
- **Create new migrations** in `database/migrations/` to rename tables and columns to camelCase. Update indexes and foreign key constraints accordingly.
- **Update seed files** in `database/seeds/` to match the camelCase schema.
- **Modify database utilities** like `server/src/knexfile.ts` and any usage of `knexSnakeCaseMappers`.
- **Verify** updated schema works in SQLite and is ready for future PostgreSQL migration.

A detailed breakdown of tasks for this phase can be found under `docs/development_docs/tasks/camelCase-phase-2/`.

## Phase 3: Backend Code Refactor
- **Models** in `server/src/models/` – update property names, query builders, and data mapping logic.
- **Controllers and services** in `server/src/controllers/` and `server/src/services/` – change references to snake_case fields, remove case‑conversion helpers.
- **Routes and middleware** in `server/src/routes/` and `server/src/middleware/` – ensure request/response objects use camelCase only.
- **Config files** in `server/src/config/` – adjust any database mapping utilities.
- **Tests** in `server/src/**/__tests__/` – update fixtures and expectations to camelCase.

A detailed breakdown of tasks for this phase can be found under `docs/development_docs/tasks/camelCase-phase-3/`.

## Phase 4: Frontend Updates
- **API service layer** in `client/src/services/` – update request payloads and response handling.
- **State management and context** in `client/src/context/` and hooks under `client/src/hooks/`.
- **React components and pages** in `client/src/components/` and `client/src/pages/` – revise prop names, form fields, and API integrations.
- **TypeScript types** in `client/src/types/` (if present) – ensure all interfaces use camelCase.

A detailed breakdown of tasks for this phase can be found under `docs/development_docs/tasks/camelCase-phase-4/`.

## Phase 5: Testing and Validation
- **Run backend test suite** via `npm --prefix server test` and update any failing tests.
- **Add or adjust client-side tests** if applicable.
- **Manual QA**: verify that API responses and the UI operate correctly with camelCase data.

## Phase 6: Deployment and Rollback Planning
- **Database backups** before applying migrations.
- **Continuous integration updates** if build scripts reference snake_case.
- **Document rollback procedures** and update README or deployment docs as needed.

This phased approach aims to minimize disruptions while ensuring consistency across the database, backend, and frontend layers.
