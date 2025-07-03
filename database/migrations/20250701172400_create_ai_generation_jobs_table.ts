import { Knex } from 'knex';

const TABLE_NAME = 'aiGenerationJobs';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    
    table
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.string('status', 50).notNullable().index();
    table.string('jobType', 100).notNullable().index();
    table.jsonb('payload').notNullable();
    table.text('result');
    table.text('errorMessage');
    
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
