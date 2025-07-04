# Migration History

## 20250107000000_create_ai_generated_content_table.ts

### Up

```ts
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
```

### Down

```ts
await knex.schema.dropTableIfExists('aiGeneratedContent');
```

## 20250616132340_create_users_table.ts

### Up

```ts
await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('passwordHash').notNullable();
    table.string('firstName').nullable();
    table.string('lastName').nullable();
    table.string('role').notNullable().defaultTo('user');
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt').notNullable();
    table.json('preferences').nullable(); // Stored as TEXT in SQLite
```

### Down

```ts
await knex.schema.dropTableIfExists('users');
  console.log('Table "users" dropped if it existed.');
```

## 20250622114409_create_user_preferences_table.ts

### Up

```ts
await knex.schema.createTable("userPreferences", (table) => {
        table.increments("id").primary();
        table.integer("userId").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
        table.json("preferences").notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
```

### Down

```ts
await knex.schema.dropTable("userPreferences");
```

## 20250625000000_create_core_learning_tables.ts

### Up

```ts
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
```

### Down

```ts
await knex.schema.dropTableIfExists('userAchievements');
  await knex.schema.dropTableIfExists('achievements');
  await knex.schema.dropTableIfExists('lessons');
  await knex.schema.dropTableIfExists('learningUnits');
  await knex.schema.dropTableIfExists('learningPaths');
  await knex.schema.dropTableIfExists('userProgress');
```

## 20250626151100_create_user_lesson_progress_table.ts

### Up

```ts
await knex.schema.createTable('userLessonProgress', (table) => {
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
```

### Down

```ts
await knex.schema.dropTableIfExists('userLessonProgress');
```

## 20250701172400_create_ai_generation_jobs_table.ts

### Up

```ts
return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    
    table
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.string('status', 50).notNullable().index();
    table.string('jobType', 100).notNullable().index();
    table.jsonb('payload').notNullable();
    table.text('result');
    table.text('errorMessage');
    
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
```

### Down

```ts
return knex.schema.dropTable(TABLE_NAME);
```

## 20250701172500_create_reusable_update_timestamp_function.ts

### Up

```ts
// This function is PostgreSQL-specific and not used with SQLite.
  // Leaving this empty to prevent errors in a non-PostgreSQL environment.
  return Promise.resolve();
```

### Down

```ts
// The function does not exist in SQLite, so no action is needed.
  return Promise.resolve();
```

