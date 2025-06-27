import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_content_completions', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('content_id').unsigned().notNullable().references('id').inTable('content').onDelete('CASCADE');
    table.timestamp('completed_at').notNullable().defaultTo(knex.fn.now());
    table.integer('attempt_number').notNullable().defaultTo(1);
    table.float('score').nullable();
    table.integer('explicit_assignment_id').unsigned().nullable().references('id').inTable('user_content_assignments').onDelete('SET NULL');
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_content_completions');
}
