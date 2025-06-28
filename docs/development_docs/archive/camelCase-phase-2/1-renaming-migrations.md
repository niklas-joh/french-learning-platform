# Task CC2.1: Create Renaming Migrations

- **Goal**: Introduce Knex migration files that rename all snake_case tables and columns to camelCase.
- **Steps**:
  1. Use the schema review from Phase 1 as a map of old names to new names.
  2. Generate migration scripts in `database/migrations/` using `knex migrate:make`.
  3. Within each script, call `renameTable` and `renameColumn` for every affected table and field.
  4. Update related indexes and foreign key constraints in the same migration to reference the new names.
  5. Include proper rollback logic so the migration can revert the names if needed.
- **Deliverable**: A set of migration files under `database/migrations/` that safely rename tables, columns, indexes, and constraints to camelCase.
