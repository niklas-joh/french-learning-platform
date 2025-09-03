import knex from 'knex';
import knexConfig from '../server/src/knexfile.js';

async function runMigration() {
  try {
    const db = knex(knexConfig.development);
    
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully.');
    
    await db.destroy();
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigration();
