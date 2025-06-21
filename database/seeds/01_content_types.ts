import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("content_types").del();

    // Inserts seed entries
    await knex("content_types").insert([
        { name: "multiple-choice" },
        { name: "fill-in-the-blank" },
        { name: "sentence-correction" }
    ]);
};
