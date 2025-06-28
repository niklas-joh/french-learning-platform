# Task CC1.4: Identify Relevant Tests

- **Goal**: Locate tests that rely on snake_case data to ensure coverage during migration.
- **Steps**:
  1. Search for `__tests__` directories under `server/src/` and any test suites in `client/`.
  2. Note fixture files or mocks that contain snake_case property names.
  3. Record how tests assert on API responses or database fields.
- **Deliverable**: A list of test files needing updates, ensuring the migration does not break existing coverage.
