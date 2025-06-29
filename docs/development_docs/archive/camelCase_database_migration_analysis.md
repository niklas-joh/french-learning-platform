# CamelCase Database Migration Analysis

**Created:** 2025-06-28  
**Status:** Ready for Implementation  
**Goal:** Complete the true camelCase migration by updating database schema directly instead of using translation layer

## Executive Summary

The current codebase uses a hybrid approach with `knex-stringcase` to translate between camelCase JavaScript and snake_case database. This analysis provides a comprehensive plan to complete the true camelCase migration by:

1. Updating all migration files to use camelCase column names
2. Updating all seed files to match the new schema
3. Removing the `knex-stringcase` dependency
4. Updating related documentation and configuration

## Current State Analysis

### Translation Layer (To Be Removed)
- **knex-stringcase package**: Currently handles automatic case conversion
- **Location**: `server/src/knexfile.ts` - `...stringcase()` configuration
- **Package dependency**: `knex-stringcase: ^1.5.5` in `server/package.json`

### Database Schema Status
- **Current**: All database columns use snake_case
- **Application Code**: Already uses camelCase (expecting translation layer)
- **Frontend**: Already uses camelCase throughout

## Files Requiring Updates

### 1. Migration Files

#### `database/migrations/20250616132340_create_users_table.ts`
**Current snake_case columns:**
- `password_hash` → `passwordHash`
- `first_name` → `firstName`
- `last_name` → `lastName`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

#### `database/migrations/20250622114409_create_user_preferences_table.ts`
**Current snake_case columns:**
- `user_id` → `userId`
- Uses `table.timestamps(true, true)` which creates `created_at` and `updated_at` → needs manual camelCase implementation

#### `database/migrations/20250625000000_create_core_learning_tables.ts`
**Tables and columns to update:**

**user_progress table:**
- `user_id` → `userId`
- `current_level` → `currentLevel`
- `current_xp` → `currentXp`
- `total_xp` → `totalXp`
- `streak_days` → `streakDays`
- `last_activity_date` → `lastActivityDate`
- `lessons_completed` → `lessonsCompleted`
- `words_learned` → `wordsLearned`
- `time_spent_minutes` → `timeSpentMinutes`
- `accuracy_rate` → `accuracyRate`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

**learning_paths table:**
- `total_lessons` → `totalLessons`
- `estimated_duration` → `estimatedDuration`
- `is_active` → `isActive`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

**learning_units table:**
- `learning_path_id` → `learningPathId`
- `order_index` → `orderIndex`
- `is_active` → `isActive`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

**lessons table:**
- `learning_unit_id` → `learningUnitId`
- `estimated_time` → `estimatedTime`
- `order_index` → `orderIndex`
- `content_data` → `contentData`
- `is_active` → `isActive`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

**achievements table:**
- `criteria_data` → `criteriaData`
- `is_active` → `isActive`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

**user_achievements table:**
- `user_id` → `userId`
- `achievement_id` → `achievementId`
- `unlocked_at` → `unlockedAt`

#### `database/migrations/20250626151100_create_user_lesson_progress_table.ts`
**Current snake_case columns:**
- `user_id` → `userId`
- `lesson_id` → `lessonId`
- `time_spent` → `timeSpent`
- `started_at` → `startedAt`
- `completed_at` → `completedAt`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

### 2. Seed Files

#### `database/seeds/00_core_data.ts`
**Tables and columns to update:**
- `learning_paths` table references: `total_lessons` → `totalLessons`, `estimated_duration` → `estimatedDuration`, `is_active` → `isActive`
- `achievements` table references: `criteria_data` → `criteriaData`, `is_active` → `isActive`

#### `database/seeds/02_users.ts`
**Columns to update:**
- `password_hash` → `passwordHash`
- `first_name` → `firstName`
- `last_name` → `lastName`

#### `database/seeds/06_learning_content.ts`
**Tables and columns to update:**
- `learning_units` table: `learning_path_id` → `learningPathId`, `order_index` → `orderIndex`, `is_active` → `isActive`
- `lessons` table: `learning_unit_id` → `learningUnitId`, `estimated_time` → `estimatedTime`, `order_index` → `orderIndex`, `content_data` → `contentData`, `is_active` → `isActive`

### 3. Configuration Files

#### `server/src/knexfile.ts`
**Changes needed:**
- Remove `import stringcase from 'knex-stringcase';`
- Remove `...stringcase(),` from both development and test configurations

#### `server/package.json`
**Changes needed:**
- Remove `"knex-stringcase": "^1.5.5"` from dependencies

#### `database/schema.sql`
**Changes needed:**
- Update all column names to camelCase for documentation consistency

## Implementation Plan

### Phase 1: Backup and Preparation
1. **Database Backup**: Create backup of current database
2. **Git Branch**: Create feature branch `camelcase-database-migration`
3. **Documentation**: Review current data and relationships

### Phase 2: Update Migration Files
1. Update `20250616132340_create_users_table.ts`
2. Update `20250622114409_create_user_preferences_table.ts`
3. Update `20250625000000_create_core_learning_tables.ts`
4. Update `20250626151100_create_user_lesson_progress_table.ts`

### Phase 3: Update Seed Files
1. Update `00_core_data.ts`
2. Update `02_users.ts`
3. Update `06_learning_content.ts`

### Phase 4: Remove Translation Layer
1. Update `server/src/knexfile.ts`
2. Remove knex-stringcase from `server/package.json`
3. Run `npm install` to update package-lock.json

### Phase 5: Database Recreation
1. Drop existing database
2. Run migrations: `npm run migrate:latest`
3. Run seeds: `npm run seed:run`

### Phase 6: Testing and Validation
1. Verify database schema matches camelCase expectations
2. Test all application functionality
3. Run existing test suites
4. Update any failing tests

### Phase 7: Documentation Updates
1. Update `database/schema.sql`
2. Update any remaining documentation references

## Special Considerations

### 1. Timestamps Handling
- Some migrations use `table.timestamps(true, true)` which automatically creates snake_case columns
- These need to be manually implemented as:
  ```typescript
  table.timestamp('createdAt').defaultTo(knex.fn.now());
  table.timestamp('updatedAt').defaultTo(knex.fn.now());
  ```

### 2. Foreign Key References
- All foreign key references need to use camelCase column names
- Example: `.references('id').inTable('users')` becomes `.references('id').inTable('users')` (table names stay snake_case)
- But: `table.integer('user_id')` becomes `table.integer('userId')`

### 3. Index and Constraint Names
- Knex will auto-generate index names based on column names
- These will automatically update to reflect camelCase column names

### 4. JSON/Text Columns
- Columns like `content_data` → `contentData` don't affect JSON content structure
- Only the column name changes, not the data format

## Risk Assessment

### Low Risk
- Early development stage allows database recreation
- Application code already expects camelCase
- Comprehensive test coverage exists

### Mitigation Strategies
- Complete backup before starting
- Test in development environment first
- Staged implementation with validation at each step

## Success Criteria

1. ✅ All database columns use camelCase
2. ✅ All application functionality works without knex-stringcase
3. ✅ All tests pass
4. ✅ No translation layer dependencies remain
5. ✅ Documentation updated to reflect new schema

## Rollback Plan

If issues arise:
1. Restore database backup
2. Revert git branch changes
3. Reinstall knex-stringcase dependency
4. Restore original knexfile.ts configuration

---

**Next Steps**: Upon approval, implement Phase 1 (Backup and Preparation) and proceed through phases systematically.
