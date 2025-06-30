import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_lesson_progress', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.integer('lessonId').notNullable().references('id').inTable('lessons');
    table.string('status').notNullable().defaultTo('locked');
    table.float('score');
    table.integer('timeSpent');
    table.integer('attempts').defaultTo(0);
    table.timestamp('startedAt');
    table.timestamp('completedAt');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.unique(['userId', 'lessonId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_lesson_progress');
}
