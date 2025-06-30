# Task CC6.3: Document Rollback Procedures

- **Goal**: Provide a clear path to revert the migration if unforeseen issues occur.
- **Steps**:
  1. Outline commands to roll back the latest Knex migration using `knex migrate:rollback`.
  2. Describe how to restore the database backup created in Task CC6.1.
  3. Note any environment variables or configuration changes that also need reverting.
- **Deliverable**: Section in `docs/DEPLOYMENT.md` detailing step‑by‑step rollback instructions.
