/**
 * @file Migration to create assessment-related tables.
 * @description This migration sets up the necessary database schema for storing AI-driven
 * assessment results and periodic user weakness analysis. It introduces three tables:
 * - `assessmentTypes`: A lookup table for different categories of assessments.
 * - `userAssessments`: Stores granular results for every assessment taken by a user.
 * - `userWeaknessAnalyses`: Stores periodic, aggregated analysis of a user's weaknesses.
 * This normalized structure ensures data integrity and scalability.
 */

import { Knex } from 'knex';

// Define constants for ENUM types to ensure consistency.
const CONFIDENCE_LEVELS = ['low', 'medium', 'high'];
const ASSESSMENT_TYPE_NAMES = ['open-ended', 'fill-in-blank', 'multiple-choice', 'speech-pronunciation'];

/**
 * Applies the migration, creating the new tables.
 * @param {Knex} knex - The Knex instance for database interaction.
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  // 1. Create the lookup table for assessment types.
  await knex.schema.createTable('assessmentTypes', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.text('description');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  // 2. Seed the assessment_types table with initial values.
  await knex('assessmentTypes').insert(
    ASSESSMENT_TYPE_NAMES.map(name => ({ name, description: `Assessment type for ${name} questions.` }))
  );

  // 3. Create the user_assessments table with a foreign key.
  await knex.schema.createTable('userAssessments', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('userContentCompletionId').unsigned().notNullable().references('id').inTable('user_content_completions').onDelete('CASCADE');
    table.integer('assessmentTypeId').unsigned().references('id').inTable('assessmentTypes').onDelete('SET NULL');
    table.text('userResponse');
    table.boolean('isCorrect').notNullable();
    table.float('score').notNullable();
    table.jsonb('feedback').notNullable();
    table.enum('confidence', CONFIDENCE_LEVELS).notNullable();
    table.jsonb('metadata');
    table.timestamp('createdAt').defaultTo(knex.fn.now());

    table.index('userId');
    table.index('userContentCompletionId');
    table.index('assessmentTypeId');
  });

  // 4. Create the weakness analysis table.
  await knex.schema.createTable('userWeaknessAnalyses', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('analyzedAt').defaultTo(knex.fn.now());
    table.integer('timeframeDays').notNullable();
    table.enum('confidenceLevel', CONFIDENCE_LEVELS).notNullable();
    table.jsonb('primaryWeaknesses');
    table.jsonb('improvementAreas');
    table.jsonb('strengthAreas');
    table.jsonb('recommendations');
    table.timestamp('createdAt').defaultTo(knex.fn.now());

    table.index('userId');
  });
}

/**
 * Reverts the migration, dropping the created tables in reverse order.
 * @param {Knex} knex - The Knex instance for database interaction.
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('userWeaknessAnalyses');
  await knex.schema.dropTableIfExists('userAssessments');
  await knex.schema.dropTableIfExists('assessmentTypes');
}
