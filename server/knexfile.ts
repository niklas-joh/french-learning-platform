import type { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '../../database/french_learning.db'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, '../..', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, '../..', 'database', 'seeds'),
    },
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, '../..', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, '../..', 'database', 'seeds'),
    },
  },
};

export default config;
