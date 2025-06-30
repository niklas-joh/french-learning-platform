# Prerequisite Task P1: Update Database Schema for Lesson Progress

-   **Objective**: Add the `user_lesson_progress` table to track individual user status on each lesson.
-   **Key Actions**:
    1.  Create migration: `server/database/migrations/YYYYMMDDHHMMSS_create_user_lesson_progress_table.ts` (using Knex schema builder).
    2.  Define `user_lesson_progress` table schema (columns: `id`, `user_id`, `lesson_id`, `status` (TEXT, default 'locked'), `score` (REAL), `time_spent` (INTEGER), `attempts` (INTEGER, default 0), `started_at` (DATETIME), `completed_at` (DATETIME), `created_at` (DATETIME, default CURRENT_TIMESTAMP), `updated_at` (DATETIME, default CURRENT_TIMESTAMP). Add Foreign Keys for `user_id` to `users(id)` and `lesson_id` to `lessons(id)`. Add `UNIQUE(user_id, lesson_id)` constraint).
    3.  Run migration.
-   **Impacted Files**: New Knex migration files in `database/migrations/`, `database/schema.sql` (generated dump, for reference), `docs/development_docs/architecture/database_schema.mermaid`.
