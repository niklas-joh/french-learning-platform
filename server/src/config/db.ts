import knex, { Knex } from 'knex';
import path from 'path';

// Determine the correct path to the database file
// The DATABASE_URL in .env is relative to the server directory
// Knex expects a filename path relative to the CWD or an absolute path.
// We construct an absolute path from the project root.
const isTest = process.env.NODE_ENV === 'test';

if (isTest) {
  console.log('INFO: Using in-memory SQLite for testing.');
}

const connection = isTest
  ? { filename: ':memory:' }
  : {
      filename: process.env.DATABASE_URL
        ? path.resolve(
            process.cwd(),
            'french-learning-platform',
            process.env.DATABASE_URL
          )
        : path.resolve(
            process.cwd(),
            'french-learning-platform/database/french_learning.db'
          ),
    };

const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection,
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(process.cwd(), 'french-learning-platform/database/migrations'),
  },
  seeds: {
    directory: path.resolve(process.cwd(), 'french-learning-platform/database/seeds'),
  },
};

const db = knex(knexConfig);

export default db;
