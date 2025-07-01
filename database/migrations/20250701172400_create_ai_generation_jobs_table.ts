import { Knex } from 'knex';

const TABLE_NAME = 'ai_generation_jobs';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').primary();
    
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.string('status', 50).notNullable().index();
    table.string('job_type', 100).notNullable().index();
    table.jsonb('payload').notNullable();
    table.text('result');
    table.text('error_message');
    
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
