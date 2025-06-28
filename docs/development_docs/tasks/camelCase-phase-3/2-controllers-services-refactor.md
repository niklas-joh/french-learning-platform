# Task CC3.2: Refactor Controllers and Services

- **Goal**: Replace all snake_case references in controllers and services with camelCase.
- **Steps**:
  1. Search `server/src/controllers/` and `server/src/services/` for underscores in property access.
  2. Update request parsing and response formatting logic to expect camelCase fields.
  3. Remove any case-conversion helpers that map snake_case DB results to camelCase objects.
  4. Ensure business logic and service methods align with the renamed models.
- **Deliverable**: Controllers and service modules that only work with camelCase data structures.
