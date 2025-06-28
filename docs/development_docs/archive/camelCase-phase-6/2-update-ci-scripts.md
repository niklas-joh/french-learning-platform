# Task CC6.2: Update Continuous Integration Scripts

- **Goal**: Ensure CI pipelines build and test against the camelCase schema.
- **Steps**:
  1. Inspect `.github/workflows/` and any other CI configs for scripts that reference snake_case tables or columns.
  2. Modify these scripts so migrations run automatically before tests using `npm run migrate` or equivalent.
  3. Remove deprecated utilities like `knexSnakeCaseMappers` if still present in the CI setup.
  4. Trigger the pipeline to confirm the build passes with camelCase tables.
- **Deliverable**: CI configuration that deploys or tests only the camelCase codebase without errors.
