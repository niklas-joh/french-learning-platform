import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('content_types', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('content_types');
}
