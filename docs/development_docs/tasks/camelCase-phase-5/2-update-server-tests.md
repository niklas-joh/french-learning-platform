# Task CC5.2: Refactor Backend Tests

- **Goal**: Update failing server tests and fixtures to align with camelCase fields.
- **Steps**:
  1. Search `server/src/**/__tests__/` for snake_case properties in mocks or expectations.
  2. Rename these properties to camelCase and adjust any helper utilities.
  3. Re-run `npm --prefix server test` to verify each updated test passes.
  4. Remove obsolete case-conversion logic from the test setup.
- **Deliverable**: Passing server-side test suite that references camelCase data exclusively.
