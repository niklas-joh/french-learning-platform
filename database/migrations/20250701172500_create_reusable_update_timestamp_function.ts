import { Knex } from 'knex';

/**
 * This migration creates a reusable PostgreSQL function that can be used by triggers
 * to automatically update the `updatedAt` timestamp on any table.
 *
 * @param knex {Knex}
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);
}

/**
 * This migration drops the reusable timestamp update function.
 *
 * @param knex {Knex}
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column();');
}
