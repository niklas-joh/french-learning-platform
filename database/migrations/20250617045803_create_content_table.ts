import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('content');
  if (!hasTable) {
    await knex.schema.createTable('content', (table) => {
      table.increments('id').primary();
      table
      .integer('topic_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('topics')
      .onDelete('SET NULL') // Or 'CASCADE' if content should be deleted with topic
      .onUpdate('CASCADE');
    table.string('type').notNullable(); // e.g., 'multiple_choice', 'fill_in_the_blank'
    table.json('question_data').notNullable(); // Store question text, explanation, etc.
    table.json('correct_answer').notNullable();
    table.json('options').nullable(); // For multiple choice, etc.
    table.string('difficulty_level').nullable();
    table.json('tags').nullable(); // Store as JSON array of strings
    table.boolean('active').defaultTo(true).notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at
    });
  } else {
    console.log('Table "content" already exists. Migration not run, or run to add missing columns if necessary.');
    // Optionally add checks for missing columns and alter table
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('content');
}
