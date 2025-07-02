import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("userPreferences", (table) => {
        table.increments("id").primary();
        table.integer("userId").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
        table.json("preferences").notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("userPreferences");
}
