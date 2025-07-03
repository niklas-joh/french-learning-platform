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

// Robustly determine the project root by resolving from the current file's location
const projectRoot = path.resolve(__dirname, '..', '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const migrationsDirectory = path.join(projectRoot, 'database', 'migrations');
console.log('[knexfile.ts] projectRoot:', projectRoot);
console.log('[knexfile.ts] Resolved migrations directory:', migrationsDirectory);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(projectRoot, 'database', 'french_learning.db'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: migrationsDirectory,
    },
    seeds: {
      directory: path.join(projectRoot, 'database', 'seeds'),
    },
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: path.join(projectRoot, 'database', 'test.sqlite3'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(projectRoot, 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(projectRoot, 'database', 'seeds'),
    },
  },
};

export default config;
