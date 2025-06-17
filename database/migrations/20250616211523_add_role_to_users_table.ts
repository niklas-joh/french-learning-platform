import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  const hasRoleColumn = await knex.schema.hasColumn('users', 'role');
  if (!hasRoleColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.string('role').notNullable().defaultTo('user');
    });
    console.log('Added column "role" to users table via second migration.');
  } else {
    console.log('Column "role" already exists in users table, second migration skipping addition.');
  }
}


export async function down(knex: Knex): Promise<void> {
  // Only drop column if it exists, to make 'down' idempotent
  const hasRoleColumn = await knex.schema.hasColumn('users', 'role');
  if (hasRoleColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('role');
    });
    console.log('Dropped column "role" from users table via second migration if it existed.');
  } else {
    console.log('Column "role" did not exist in users table, second migration skipping drop.');
  }
}
