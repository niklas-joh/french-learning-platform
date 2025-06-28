# Task CC2.4: Validate Schema Migration

- **Goal**: Confirm that the new camelCase schema functions correctly in SQLite and remains compatible with PostgreSQL.
- **Steps**:
  1. Apply the renaming migrations and updated seeds in a fresh local environment.
  2. Run the existing test suite with `npm --prefix server test` to catch regressions.
  3. Spin up a PostgreSQL instance (e.g., via Docker) and run the same migrations to identify platform-specific issues.
  4. Record any failures or discrepancies and update the migrations or configs accordingly.
- **Deliverable**: A validation report summarizing test results and required adjustments for cross-database compatibility.
