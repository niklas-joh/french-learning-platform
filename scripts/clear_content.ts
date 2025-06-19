import knex from 'knex';
import knexConfig from '../server/knexfile';

// Initialize Knex with the development configuration
const db = knex(knexConfig.development);

async function clearContent() {
  try {
    console.log('Starting to clear the content table...');

    // Disable foreign key checks for SQLite to allow truncation
    await db.raw('PRAGMA foreign_keys = OFF;');

    // Truncate the content table
    await db('content').truncate();

    console.log('The content table has been cleared successfully.');

  } catch (error) {
    console.error('Error clearing content table:', error);
  } finally {
    // Re-enable foreign key checks
    await db.raw('PRAGMA foreign_keys = ON;');
    // Close the database connection
    await db.destroy();
    console.log('Database connection closed.');
  }
}

clearContent();
