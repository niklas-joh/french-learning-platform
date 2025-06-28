# Task CC1.2: Catalogue Backend Source

- **Goal**: Identify all server code referencing snake_case fields.
- **Steps**:
  1. Search `server/src/` for snake_case patterns (e.g., using `grep -n "_"`).
  2. Note models, controllers, services, and route handlers that expect snake_case data.
  3. Document any utilities or middleware (like `knexSnakeCaseMappers`) that perform case conversion.
- **Deliverable**: A summary file listing affected server modules and potential refactor areas.
