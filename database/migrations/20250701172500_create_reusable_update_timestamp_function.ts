import { Knex } from 'knex';

/**
 * This migration creates a reusable PostgreSQL function that can be used by triggers
 * to automatically update the `updatedAt` timestamp on any table.
 *
 * @param knex {Knex}
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  // This function is PostgreSQL-specific and not used with SQLite.
  // Leaving this empty to prevent errors in a non-PostgreSQL environment.
  return Promise.resolve();
}

/**
 * This migration drops the reusable timestamp update function.
 *
 * @param knex {Knex}
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  // The function does not exist in SQLite, so no action is needed.
  return Promise.resolve();
}
