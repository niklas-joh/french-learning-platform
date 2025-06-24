/**
 * Knex database instance used throughout the backend.
 *
 * The configuration is loaded from `knexfile.ts` based on the current
 * `NODE_ENV`. Tests use the in-memory SQLite database defined there.
 */
import knex from 'knex';
import config from '../knexfile';

const env = process.env.NODE_ENV || 'development';
const db = knex(config[env]);

// TODO: expose a function to gracefully close the connection pool when the
// application shuts down.

export default db;
