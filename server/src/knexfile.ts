/**
 * Knex configuration used by scripts and the database module.
 *
 * Separate configurations are provided for the development and test
 * environments. Tests run against an in-memory SQLite database to avoid
 * touching the developer's local data.
 * 
 * @file Enhanced with proper TypeScript type safety following development principles
 * @version 2.0 - Fixed Knex namespace type usage for ESM compliance
 */
import Knex from 'knex';
import type { Knex as KnexTypes } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Robustly determine the project root by resolving from the current file's location
// In ES modules, we need to use import.meta.url instead of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const migrationsDirectory = path.join(projectRoot, 'database', 'migrations');
console.log('[knexfile.ts] projectRoot:', projectRoot);
console.log('[knexfile.ts] Resolved migrations directory:', migrationsDirectory);

/**
 * Knex configuration object with proper TypeScript type safety
 * Uses KnexTypes.Config for type-only import as per development principles
 */
const config: { [key: string]: KnexTypes.Config } = {
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
