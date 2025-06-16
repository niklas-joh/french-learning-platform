const fs = require('fs/promises');
const path = require('path');
const db = require('../server/src/config/db').default; // Adjust path to db config and access default export

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Ensure the database directory exists (Knex might do this, but good to be sure)
    const dbDirectory = path.dirname(db.client.config.connection.filename);
    try {
      await fs.access(dbDirectory);
    } catch (error) {
      console.log(`Database directory ${dbDirectory} does not exist, creating...`);
      await fs.mkdir(dbDirectory, { recursive: true });
    }
    
    // Path to schema.sql relative to the project root
    const schemaPath = path.resolve(__dirname, '../database/schema.sql');
    console.log(`Reading schema from: ${schemaPath}`);
    
    const schema = await fs.readFile(schemaPath, 'utf-8');
    
    // Split schema into individual statements to avoid issues with some SQLite drivers
    const statements = schema.split(';').map((stmt: string) => stmt.trim()).filter((stmt: string) => stmt.length > 0);

    // Knex raw can execute the entire schema string directly if the driver supports it.
    // However, for broader compatibility and to ensure each statement is processed,
    // it's often better to execute them one by one or ensure the driver handles multi-statement queries.
    // For SQLite with knex, db.raw(schema) should generally work.
    
    console.log('Applying schema...');
    // await db.raw(schema); // Option 1: Execute entire schema at once

    // Option 2: Execute statements one by one (more robust for complex schemas or specific drivers)
    for (const statement of statements) {
      if (statement) { // Ensure statement is not empty
        await db.raw(statement + ';'); // Add semicolon back
      }
    }

    console.log('Database schema applied successfully.');
    
    // Verify by listing tables (optional)
    const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
    console.log('Tables created:', tables.map((t: { name: string }) => t.name).join(', '));

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1); // Exit with error code
  } finally {
    await db.destroy(); // Close the database connection
    console.log('Database connection closed.');
  }
}

initializeDatabase();
