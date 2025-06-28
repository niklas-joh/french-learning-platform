# Task CC2.2: Update Seed Data

- **Goal**: Ensure all seed scripts insert data using the new camelCase schema.
- **Steps**:
  1. Search under `database/seeds/` for snake_case column names or table references.
  2. Update each seed file to use camelCase keys and updated table names.
  3. Verify relationship mappings (e.g., foreign keys) still align with the renamed schema.
  4. Run `knex seed:run` locally after applying the renaming migrations to confirm the data loads correctly.
- **Deliverable**: Updated seed files that populate the database successfully after the camelCase migrations.
