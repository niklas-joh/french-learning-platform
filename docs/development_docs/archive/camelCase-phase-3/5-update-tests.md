# Task CC3.5: Update Backend Tests

- **Goal**: Align all server-side tests with the camelCase schema and API responses.
- **Steps**:
  1. Search under `server/src/**/__tests__/` for assertions that use snake_case keys.
  2. Update fixtures, mocks, and expected data structures to camelCase.
  3. Run `npm --prefix server test` to ensure the refactored code passes.
  4. Adjust any failing tests and verify coverage remains roughly the same.
- **Deliverable**: Passing backend test suite with fixtures updated to camelCase.
