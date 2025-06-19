import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('topics', (table) => {
    table.renameColumn('name', 'title');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('topics', (table) => {
    table.renameColumn('title', 'name');
  });
}
