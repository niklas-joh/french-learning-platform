// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../server/src/config/db').default; // Adjust path and get default export for Knex instance

const ADMIN_EMAIL = 'admin@example.com';

async function setAdminUser() {
  try {
    const user = await db('users').where({ email: ADMIN_EMAIL }).first();

    if (!user) {
      console.error(`Error: User with email ${ADMIN_EMAIL} not found.`);
      console.log(`Please ensure this user exists. You might need to register them first.`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`User ${ADMIN_EMAIL} is already an admin.`);
      process.exit(0);
    }

    await db('users').where({ email: ADMIN_EMAIL }).update({ role: 'admin' });
    console.log(`Successfully set user ${ADMIN_EMAIL} to role 'admin'.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to set admin user:', error);
    process.exit(1);
  } finally {
    await db.destroy(); // Close the database connection
  }
}

setAdminUser();

export {}; // Treat this file as a module for TypeScript's checker
