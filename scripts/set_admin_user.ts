import db from '../server/src/config/db'; // Adjust path to Knex instance

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
