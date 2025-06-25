import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_content_assignments', function(table) {
    table.timestamp('due_date').nullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_content_assignments', function(table) {
    table.dropColumn('due_date');
  });
}
