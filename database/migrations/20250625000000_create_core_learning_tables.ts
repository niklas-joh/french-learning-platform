import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Starting migration: 20250625000000_create_core_learning_tables.ts');

  await knex.schema.createTable('user_progress', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.string('current_level').notNullable().defaultTo('A1');
    table.integer('current_xp').notNullable().defaultTo(0);
    table.integer('total_xp').notNullable().defaultTo(0);
    table.integer('streak_days').notNullable().defaultTo(0);
    table.date('last_activity_date');
    table.integer('lessons_completed').notNullable().defaultTo(0);
    table.integer('words_learned').notNullable().defaultTo(0);
    table.integer('time_spent_minutes').notNullable().defaultTo(0);
    table.float('accuracy_rate').notNullable().defaultTo(0.0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  console.log('Created table: user_progress');

  await knex.schema.createTable('learning_paths', (table) => {
    table.increments('id').primary();
    table.string('language').notNullable().defaultTo('french');
    table.string('name').notNullable();
    table.text('description');
    table.integer('total_lessons').notNullable().defaultTo(0);
    table.integer('estimated_duration');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  console.log('Created table: learning_paths');

  await knex.schema.createTable('learning_units', (table) => {
    table.increments('id').primary();
    table.integer('learning_path_id').notNullable().references('id').inTable('learning_paths');
    table.string('title').notNullable();
    table.text('description');
    table.string('level').notNullable();
    table.integer('order_index').notNullable();
    table.text('prerequisites');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  console.log('Created table: learning_units');

  await knex.schema.createTable('lessons', (table) => {
    table.increments('id').primary();
    table.integer('learning_unit_id').notNullable().references('id').inTable('learning_units');
    table.string('title').notNullable();
    table.text('description');
    table.string('type').notNullable();
    table.integer('estimated_time').notNullable();
    table.integer('order_index').notNullable();
    table.text('content_data');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  console.log('Created table: lessons');

  await knex.schema.createTable('achievements', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('icon').notNullable();
    table.string('category').notNullable();
    table.text('criteria_data').notNullable();
    table.string('rarity').notNullable().defaultTo('common');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  console.log('Created table: achievements');

  await knex.schema.createTable('user_achievements', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.string('achievement_id').notNullable().references('id').inTable('achievements');
    table.timestamp('unlocked_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'achievement_id']);
  });
  console.log('Created table: user_achievements');

  console.log('Finished migration: 20250625000000_create_core_learning_tables.ts');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_achievements');
  await knex.schema.dropTableIfExists('achievements');
  await knex.schema.dropTableIfExists('lessons');
  await knex.schema.dropTableIfExists('learning_units');
  await knex.schema.dropTableIfExists('learning_paths');
  await knex.schema.dropTableIfExists('user_progress');
}
