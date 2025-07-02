/**
 * Knex configuration used by scripts and the database module.
 *
 * Separate configurations are provided for the development and test
 * environments. Tests run against an in-memory SQLite database to avoid
 * touching the developer's local data.
 */
import { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';
import { knexSnakeCaseMappers } from 'objection';

dotenv.config();

const migrationsDirectory = path.resolve(__dirname, '..', '..', 'database', 'migrations');
console.log('[knexfile.ts] __dirname:', __dirname);
console.log('[knexfile.ts] Resolved migrations directory:', migrationsDirectory);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '..', '..', 'database', 'french_learning.db'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: migrationsDirectory,
    },
    seeds: {
      directory: path.resolve(__dirname, '..', '..', 'database', 'seeds'),
    },
    ...knexSnakeCaseMappers(),
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    // TODO: consider using a temporary file database for easier debugging of
    // failing tests.
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, '..', '..', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, '..', '..', 'database', 'seeds'),
    },
    ...knexSnakeCaseMappers(),
  },
};

export default config;
