# Task CC2.3: Refactor Database Utilities

- **Goal**: Modify Knex configuration and helper utilities so they assume camelCase naming.
- **Steps**:
  1. Review `server/src/knexfile.ts` for usage of `knexSnakeCaseMappers` or similar utilities.
  2. Remove or adjust these mappers so the application no longer auto-converts between cases.
  3. Search `server/src/` for helper functions that transform snake_case results to camelCase and refactor them as needed.
  4. Double-check environment-specific configs to ensure both SQLite and PostgreSQL use the same conventions.
- **Deliverable**: Updated configuration and helper files that work with camelCase columns directly.
