const knex = require('knex');
const knexConfig = require('../server/knexfile');

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
