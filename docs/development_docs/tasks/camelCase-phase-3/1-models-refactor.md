# Task CC3.1: Update Models to CamelCase

- **Goal**: Ensure all model definitions and query builders use camelCase field names.
- **Steps**:
  1. Search `server/src/models/` for property names containing underscores.
  2. Rename model attributes and TypeScript interfaces to camelCase.
  3. Update any query builder logic that references snake_case columns.
  4. Remove utilities that convert between cases if they are still used.
- **Deliverable**: Updated model files with camelCase properties and queries.
