// database/migrations/20250107000000_create_ai_generated_content_table.ts

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('aiGeneratedContent', (table) => {
    table.uuid('id').primary().notNullable();
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('type', [
      'lesson',
      'vocabulary_drill',
      'grammar_exercise',
      'cultural_content',
      'personalized_exercise',
      'pronunciation_drill',
      'conversation_practice'
    ]).notNullable();
    table.enum('status', [
      'pending',
      'generating',
      'completed',
      'failed',
      'cached'
    ]).notNullable().defaultTo('pending');
    table.json('requestPayload').notNullable();
    table.json('generatedData').nullable();
    table.json('validationResults').nullable();
    table.json('metadata').nullable();
    table.string('level', 10).nullable();
    table.json('topics').nullable();
    table.json('focusAreas').nullable();
    table.integer('estimatedCompletionTime').nullable();
    table.float('validationScore').nullable();
    table.integer('generationTimeMs').nullable();
    table.integer('tokenUsage').nullable();
    table.string('modelUsed', 50).nullable();
    table.integer('usageCount').defaultTo(0);
    table.datetime('lastAccessedAt').nullable();
    table.datetime('expiresAt').nullable();
    table.datetime('createdAt').defaultTo(knex.fn.now()).notNullable();
    table.datetime('updatedAt').defaultTo(knex.fn.now()).notNullable();

    table.index(['status'], 'idx_ai_content_status');
    table.index(['type', 'level'], 'idx_ai_content_type_level');
    table.index(['createdAt'], 'idx_ai_content_created');
    table.index(['expiresAt'], 'idx_ai_content_expires');
    table.index(['usageCount'], 'idx_ai_content_usage');
    table.index(['userId', 'type', 'level', 'status'], 'idx_ai_content_cache_lookup');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('aiGeneratedContent');
}
