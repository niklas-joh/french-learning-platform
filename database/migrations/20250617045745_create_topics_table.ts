import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('topics');
  if (!hasTable) {
    await knex.schema.createTable('topics', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
    table.text('description').nullable();
    table.string('category').nullable();
    table.boolean('active').defaultTo(true).notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at
    });
  } else {
    // Optionally, add columns if they don't exist, or log that table already exists
    console.log('Table "topics" already exists. Migration not run, or run to add missing columns if necessary.');
    // Example: Add a column if it doesn't exist
    // if (!await knex.schema.hasColumn('topics', 'new_column')) {
    //   await knex.schema.alterTable('topics', (table) => {
    //     table.string('new_column').nullable();
    //   });
    // }
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('topics');
}
