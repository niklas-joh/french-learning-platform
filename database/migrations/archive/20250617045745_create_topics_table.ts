import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('topics', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.text('description').nullable();
    table.string('category').nullable();
    table.boolean('active').defaultTo(true).notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('topics');
}
