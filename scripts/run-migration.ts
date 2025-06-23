const knex = require('knex');
// The Knex configuration was moved under `server/src`.  Require the TypeScript
// file directly so `ts-node` can execute migrations without a missing module
// error.
const knexConfig = require('../server/src/knexfile');

const db = knex(knexConfig.development);

async function runMigration() {
  try {
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await db.destroy();
  }
}

runMigration();
