# Task CC3.4: Adjust Configuration and Utilities

- **Goal**: Update backend configuration files and helper utilities to default to camelCase.
- **Steps**:
  1. Inspect `server/src/config/` for any case-mapping utilities or references to snake_case tables.
  2. Remove use of `knexSnakeCaseMappers` or similar helpers now that the database uses camelCase.
  3. Update environment-specific configurations so they remain consistent across SQLite and PostgreSQL.
  4. Search helper modules across `server/src/` for functions that convert case and refactor as needed.
- **Deliverable**: Configuration and utility code that operates directly on camelCase fields without conversion.
