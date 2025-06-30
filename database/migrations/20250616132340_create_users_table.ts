import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('passwordHash').notNullable();
    table.string('firstName').nullable();
    table.string('lastName').nullable();
    table.string('role').notNullable().defaultTo('user');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.json('preferences').nullable(); // Stored as TEXT in SQLite
  });
  console.log('Table "users" creation attempted.'); // Simplified log
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  console.log('Table "users" dropped if it existed.');
}
