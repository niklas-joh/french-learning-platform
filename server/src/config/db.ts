import knex, { Knex } from 'knex';
import path from 'path';

// Determine the correct path to the database file
// The DATABASE_URL in .env is relative to the server directory
// Knex expects a filename path relative to the CWD or an absolute path.
// We construct an absolute path from the project root.
const dbPath = process.env.DATABASE_URL
  ? path.resolve(process.cwd(), process.env.DATABASE_URL)
  : path.resolve(process.cwd(), 'database/french_learning.db'); // Default if not set

const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(process.cwd(), 'database/migrations'),
  },
  seeds: {
    directory: path.resolve(process.cwd(), 'database/seeds'),
  },
};

const db = knex(knexConfig);

export default db;
