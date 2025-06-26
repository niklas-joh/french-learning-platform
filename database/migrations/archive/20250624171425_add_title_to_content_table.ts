import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('content', (table) => {
        table.string('title').nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('content', (table) => {
        table.dropColumn('title');
    });
}
