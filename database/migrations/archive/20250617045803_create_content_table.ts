import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('content', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().defaultTo('Unnamed Content');
    table.string('title').nullable();
    table
      .integer('topic_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('topics')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
    table
      .integer('content_type_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('content_types') // Assuming content_types table is created before this
      .onDelete('SET NULL');
    table.json('question_data').notNullable();
    table.json('correct_answer').notNullable();
    table.json('options').nullable();
    table.string('difficulty_level').nullable();
    table.json('tags').nullable();
    table.boolean('active').defaultTo(true).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('content');
}
