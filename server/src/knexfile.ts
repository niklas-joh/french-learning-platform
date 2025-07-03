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
// Determine the project root based on the current working directory
// When running via Knex CLI, the working directory is changed to server/src
// When running from migration scripts, the working directory is the project root
const isRunningFromServerSrc = process.cwd().endsWith(path.join('server', 'src'));
const projectRoot = isRunningFromServerSrc 
  ? path.resolve(process.cwd(), '..', '..')
  : process.cwd();

dotenv.config();

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
      directory: path.join(projectRoot, 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(projectRoot, 'database', 'seeds'),
    },
    ...knexSnakeCaseMappers(),
  },
};

export default config;
