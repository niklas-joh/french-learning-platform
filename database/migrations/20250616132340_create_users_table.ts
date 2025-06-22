import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable('users');
  if (!tableExists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.string('first_name').nullable();
      table.string('last_name').nullable();
      table.string('role').notNullable().defaultTo('user');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.json('preferences').nullable(); // Stored as TEXT in SQLite
    });
    console.log('Table "users" created successfully.');
  } else {
    console.log('Table "users" already exists, attempting to add missing columns if necessary...');
    // Check and add columns if they don't exist, to make the table match the schema
    // This is to handle cases where the table exists but might be from an older schema
    if (!(await knex.schema.hasColumn('users', 'first_name'))) {
      await knex.schema.alterTable('users', (table) => { table.string('first_name').nullable(); });
      console.log('Added column "first_name" to users table.');
    }
    if (!(await knex.schema.hasColumn('users', 'last_name'))) {
      await knex.schema.alterTable('users', (table) => { table.string('last_name').nullable(); });
      console.log('Added column "last_name" to users table.');
    }
    if (!(await knex.schema.hasColumn('users', 'role'))) {
      await knex.schema.alterTable('users', (table) => { table.string('role').notNullable().defaultTo('user'); });
      console.log('Added column "role" to users table.');
    }
    if (!(await knex.schema.hasColumn('users', 'preferences'))) {
      await knex.schema.alterTable('users', (table) => { table.json('preferences').nullable(); });
      console.log('Added column "preferences" to users table.');
    }
    // Ensure created_at and updated_at exist (though defaultTo might not apply on alter)
     if (!(await knex.schema.hasColumn('users', 'created_at'))) {
      await knex.schema.alterTable('users', (table) => { table.timestamp('created_at').defaultTo(knex.fn.now()); });
      console.log('Added column "created_at" to users table.');
    }
     if (!(await knex.schema.hasColumn('users', 'updated_at'))) {
      await knex.schema.alterTable('users', (table) => { table.timestamp('updated_at').defaultTo(knex.fn.now()); });
      console.log('Added column "updated_at" to users table.');
    }
  }
}


export async function down(knex: Knex): Promise<void> {
  // To make 'down' more robust, only drop columns if they were added by this specific version of 'up'
  // or simply drop the table if it was created by this 'up'.
  // For simplicity, we'll stick to dropping the table.
  await knex.schema.dropTableIfExists('users');
  console.log('Table "users" dropped if it existed.');
}
