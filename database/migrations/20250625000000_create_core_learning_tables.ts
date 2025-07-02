import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Starting migration: 20250625000000_create_core_learning_tables.ts');

  await knex.schema.createTable('userProgress', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.string('currentLevel').notNullable().defaultTo('A1');
    table.integer('currentXp').notNullable().defaultTo(0);
    table.integer('totalXp').notNullable().defaultTo(0);
    table.integer('streakDays').notNullable().defaultTo(0);
    table.date('lastActivityDate');
    table.integer('lessonsCompleted').notNullable().defaultTo(0);
    table.integer('wordsLearned').notNullable().defaultTo(0);
    table.integer('timeSpentMinutes').notNullable().defaultTo(0);
    table.float('accuracyRate').notNullable().defaultTo(0.0);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
  console.log('Created table: userProgress');

  await knex.schema.createTable('learningPaths', (table) => {
    table.increments('id').primary();
    table.string('language').notNullable().defaultTo('french');
    table.string('name').notNullable();
    table.text('description');
    table.integer('totalLessons').notNullable().defaultTo(0);
    table.integer('estimatedDuration');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
  console.log('Created table: learningPaths');

  await knex.schema.createTable('learningUnits', (table) => {
    table.increments('id').primary();
    table.integer('learningPathId').notNullable().references('id').inTable('learningPaths');
    table.string('title').notNullable();
    table.text('description');
    table.string('level').notNullable();
    table.integer('orderIndex').notNullable();
    table.text('prerequisites');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
  console.log('Created table: learningUnits');

  await knex.schema.createTable('lessons', (table) => {
    table.increments('id').primary();
    table.integer('learningUnitId').notNullable().references('id').inTable('learningUnits');
    table.string('title').notNullable();
    table.text('description');
    table.string('type').notNullable();
    table.integer('estimatedTime').notNullable();
    table.integer('orderIndex').notNullable();
    table.text('contentData');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
  console.log('Created table: lessons');

  await knex.schema.createTable('achievements', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('icon').notNullable();
    table.string('category').notNullable();
    table.text('criteriaData').notNullable();
    table.string('rarity').notNullable().defaultTo('common');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
  console.log('Created table: achievements');

  await knex.schema.createTable('userAchievements', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.string('achievementId').notNullable().references('id').inTable('achievements');
    table.timestamp('unlockedAt').defaultTo(knex.fn.now());
    table.unique(['userId', 'achievementId']);
  });
  console.log('Created table: userAchievements');

  console.log('Finished migration: 20250625000000_create_core_learning_tables.ts');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('userAchievements');
  await knex.schema.dropTableIfExists('achievements');
  await knex.schema.dropTableIfExists('lessons');
  await knex.schema.dropTableIfExists('learningUnits');
  await knex.schema.dropTableIfExists('learningPaths');
  await knex.schema.dropTableIfExists('userProgress');
}
