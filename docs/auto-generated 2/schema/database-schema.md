# Database Schema

## knex_migrations
- **id** `undefined`
- **name** `undefined` nullable
- **batch** `undefined` nullable
- **migration_time** `undefined` nullable

## knex_migrations_lock
- **index** `undefined`
- **is_locked** `undefined` nullable

## users
- **id** `undefined`
- **email** `undefined`
- **passwordHash** `undefined`
- **firstName** `undefined` nullable
- **lastName** `undefined` nullable
- **role** `undefined`
- **createdAt** `undefined` nullable
- **updatedAt** `undefined` nullable
- **preferences** `undefined` nullable

## user_preferences
- **id** `undefined`
- **userId** `undefined`
- **preferences** `undefined`
- **createdAt** `undefined` nullable
- **updatedAt** `undefined` nullable

### Foreign Keys
- userId -> undefined.undefined

## user_progress
- **id** `undefined`
- **userId** `undefined`
- **currentLevel** `undefined`
- **currentXp** `undefined`
- **totalXp** `undefined`
- **streakDays** `undefined`
- **lastActivityDate** `undefined` nullable
- **lessonsCompleted** `undefined`
- **wordsLearned** `undefined`
- **timeSpentMinutes** `undefined`
- **accuracyRate** `undefined`
- **createdAt** `undefined` nullable
- **updatedAt** `undefined` nullable

### Foreign Keys
- userId -> undefined.undefined

## learning_paths
- **id** `undefined`
- **language** `undefined`
- **name** `undefined`
- **description** `undefined` nullable
- **totalLessons** `undefined`
- **estimatedDuration** `undefined` nullable
- **isActive** `undefined` nullable
- **createdAt** `undefined` nullable
- **updatedAt** `undefined` nullable

## learning_units
- **id** `undefined`
- **learningPathId** `undefined`
- **title** `undefined`
- **description** `undefined` nullable
- **level** `undefined`
- **orderIndex** `undefined`
- **prerequisites** `undefined` nullable
- **isActive** `undefined` nullable
- **createdAt** `undefined` nullable
- **updatedAt** `undefined` nullable

### Foreign Keys
- learningPathId -> undefined.undefined

## lessons
- **id** `undefined`
- **learningUnitId** `undefined`
- **title** `undefined`
- **description** `undefined` nullable
- **type** `undefined`
- **estimatedTime** `undefined`
- **orderIndex** `undefined`
- **contentData** `undefined` nullable
- **isActive** `undefined` nullable
- **createdAt** `undefined` nullable
- **updatedAt** `undefined` nullable

### Foreign Keys
- learningUnitId -> undefined.undefined

## achievements
- **id** `undefined` nullable
- **name** `undefined`
- **description** `undefined`
- **icon** `undefined`
- **category** `undefined`
- **criteriaData** `undefined`
- **rarity** `undefined`
- **isActive** `undefined` nullable
- **createdAt** `undefined` nullable
- **updatedAt** `undefined` nullable

## user_achievements
- **id** `undefined`
- **userId** `undefined`
- **achievementId** `undefined`
- **unlockedAt** `undefined` nullable

### Foreign Keys
- achievementId -> undefined.undefined
- userId -> undefined.undefined

## user_lesson_progress
- **id** `undefined`
- **userId** `undefined`
- **lessonId** `undefined`
- **status** `undefined`
- **score** `undefined` nullable
- **timeSpent** `undefined` nullable
- **attempts** `undefined` nullable
- **startedAt** `undefined` nullable
- **completedAt** `undefined` nullable
- **createdAt** `undefined` nullable
- **updatedAt** `undefined` nullable

### Foreign Keys
- lessonId -> undefined.undefined
- userId -> undefined.undefined

