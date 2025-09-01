# Future Implementation Considerations (Curated)

This document lists unique, high‑value future tasks that directly improve the end‑user experience or reliability. It removes duplicates, completed items, and AI tasks already tracked elsewhere. For AI‑related work, see `docs/development_docs/tasks/phase-3_AI_integration/phase3_master_tracking.md`. Completed plans live in `docs/development_docs/archive`.

Aligned with our development principles, each item favors simplicity, reuses existing patterns, and targets measurable impact.

## 1) Migrate Server State to TanStack Query
- Problem: Custom hooks lack caching, request de‑duplication, and refetch policies, causing redundant calls and sluggish UX.
- Solution: Incrementally adopt TanStack Query for server state. Start with learning path data, then extend to AI dashboard queries.
- User Value: Snappier UI, less loading, fewer glitches on navigation/refresh.

## 2) Paginate/Lazy‑Load Learning Path Data
- Problem: Large learning paths load entire trees in a single request causing heavy payloads and slow initial renders.
- Solution: Add backend pagination (units first, lessons on demand) and client lazy loading.
- User Value: Faster first paint and smoother scrolling on big paths.

## 3) Virtualize Long Lists
- Problem: Rendering many units/lessons degrades performance on mobile and low‑end devices.
- Solution: Use `react-window`/`react-virtual` to only render visible items.
- User Value: Consistently smooth scrolling and interaction.

## 4) Dynamic Learning Path Selection
- Problem: `pathId` is currently fixed, preventing users from switching learning paths.
- Solution: List available learning paths, allow selection (dropdown/page), and persist the choice (URL/state).
- User Value: Users pick the path that matches their goals.

## 5) Prerequisite‑Based Unlocking (Non‑Linear Paths)
- Problem: Only linear progression is supported; `prerequisites` on `learning_units` is unused.
- Solution: Enforce unlock rules based on a structured prerequisites field and user completion state.
- User Value: Smarter, pedagogically sound branching curricula.

## 6) Runtime Schema Validation for Lesson Content (Frontend)
- Problem: TypeScript alone can’t guarantee runtime safety of `lesson.content_data` received from API.
- Solution: Validate lesson payloads with shared Zod schemas on the frontend (backend raw AI Zod already exists).
- User Value: Fewer runtime crashes; more reliable lesson rendering.

## 7) User Notifications for AI Job Completion
- Problem: Users have to poll or guess when generated content is ready.
- Solution: Add lightweight UX signals (toasts/badges) triggered by existing job‑status polling; consider WebSocket push later.
- User Value: Clear feedback loop; users return when content is ready.

## 8) End‑to‑End Tests for Core Journeys
- Problem: Regression risk across key flows (sign‑in → learning path → AI generation → lesson consumption).
- Solution: Add a minimal E2E suite covering happy paths and a few error cases.
- User Value: Fewer regressions on critical user journeys.

## 9) Structured Logging and Error Reporting
- Problem: `console.log` lacks levels, structure, and routing, reducing our ability to diagnose production issues.
- Solution: Integrate Pino, standardize log levels/fields, and add environment‑specific outputs.
- User Value: Faster fixes for user‑facing issues; improved reliability.

## 10) Storage Optimization for Large JSON Payloads
- Problem: Storing large JSON in DB rows increases cost and slows queries at scale.
- Solution: Compress large blobs before storage; optionally offload very large objects to object storage and persist references.
- User Value: Sustained performance and reliability as content volume grows.

## 11) Automate Schema Snapshot Generation
- Problem: Manually maintained `schema.sql` can drift from migrations and mislead developers.
- Solution: Provide an automated `npm run db:schema:dump` to produce a fresh schema snapshot in development.
- User Value: Fewer integration mistakes; faster onboarding.

---

Notes
- AI tasks (cost optimization, caching, orchestration, dashboards, analytics, persistence, queues) are tracked in `phase3_master_tracking.md` and/or marked completed in `docs/development_docs/archive`. They were removed here to avoid duplication.
- All items above should be implemented by extending existing services/hooks following `docs/development_docs/development_principles.md` (reuse first, <100 new lines, no service proliferation).

