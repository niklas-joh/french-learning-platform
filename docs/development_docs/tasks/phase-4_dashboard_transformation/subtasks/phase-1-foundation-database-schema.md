# Phase 1: Foundation & Database Schema

**Phase**: 1 of 5  
**Priority**: CRITICAL  
**Estimated Duration**: 3-4 days  
**Dependencies**: None - Foundation phase  
**Deliverable**: Enhanced database schema with gamification and social infrastructure

## Overview

Establish the database foundation for gamification, social features, and OAuth integration while maintaining full backward compatibility with existing user data and progress tracking.

## Design Specifications

### Database Schema Extensions

**Visual Entity Relationship Additions:**
- 5 new tables seamlessly integrated with existing schema
- Maintains referential integrity with current `users` and `userProgress` tables
- Designed for efficient querying with proper indexing strategy

**Performance Considerations:**
- Composite indexes on frequently queried combinations
- Efficient relationship modeling to minimize JOIN operations
- Prepared for high-frequency XP and social interaction queries

## Detailed Changes Required

### 1. Database Migration Files (NEW)

**File**: `database/migrations/20250913000001_add_gamification_tables.ts`
```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Starting migration: 20250913000001_add_gamification_tables.ts');

  // Daily Goals Table
  await knex.schema.createTable('dailyGoals', (table) => {
    table.string('id').primary(); // UUID format: goal_YYYYMMDD_userId
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.date('date').notNullable(); // YYYY-MM-DD format
    table.integer('targetXp').notNullable().defaultTo(50);
    table.integer('targetLessons').notNullable().defaultTo(3);
    table.integer('targetMinutes').notNullable().defaultTo(20);
    table.integer('currentXp').notNullable().defaultTo(0);
    table.integer('currentLessons').notNullable().defaultTo(0);
    table.integer('currentMinutes').notNullable().defaultTo(0);
    table.boolean('completed').notNullable().defaultTo(false);
    table.timestamp('completedAt').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    // Indexes for performance
    table.unique(['userId', 'date']); // One goal per user per day
    table.index(['date', 'completed']); // Query by date and completion status
    table.index(['userId', 'completed']); // User's completion history
  });

  // Badges/Achievements Extension (enhance existing achievements table)
  await knex.schema.createTable('badges', (table) => {
    table.string('id').primary(); // e.g., 'first_lesson', 'week_streak_7'
    table.string('name').notNullable(); // Display name
    table.text('description').notNullable();
    table.string('iconUrl').notNullable(); // URL to badge icon
    table.string('category').notNullable(); // 'streak', 'achievement', 'social', 'skill'
    table.string('rarity').notNullable().defaultTo('common'); // 'common', 'rare', 'epic', 'legendary'
    table.json('criteria').notNullable(); // JSON criteria for earning badge
    table.integer('xpReward').notNullable().defaultTo(10);
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['category', 'isActive']); // Query badges by category
    table.index(['rarity', 'isActive']); // Query by rarity
  });

  // User Badge Achievements
  await knex.schema.createTable('userBadges', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('badgeId').notNullable().references('id').inTable('badges').onDelete('CASCADE');
    table.timestamp('unlockedAt').defaultTo(knex.fn.now());
    table.json('metadata').nullable(); // Context about how badge was earned
    
    // Constraints and indexes
    table.unique(['userId', 'badgeId']); // Prevent duplicate badges
    table.index(['userId', 'unlockedAt']); // User's badge timeline
    table.index(['badgeId', 'unlockedAt']); // Badge popularity over time
  });

  console.log('Created gamification tables: dailyGoals, badges, userBadges');
  console.log('Finished migration: 20250913000001_add_gamification_tables.ts');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('userBadges');
  await knex.schema.dropTableIfExists('badges');
  await knex.schema.dropTableIfExists('dailyGoals');
}
```

**File**: `database/migrations/20250913000002_add_oauth_integration.ts`
```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Starting migration: 20250913000002_add_oauth_integration.ts');

  // OAuth Profiles Table
  await knex.schema.createTable('oauthProfiles', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('provider').notNullable(); // 'google', 'facebook'
    table.string('providerId').notNullable(); // OAuth provider's user ID
    table.string('email').notNullable();
    table.string('displayName').nullable();
    table.string('firstName').nullable();
    table.string('lastName').nullable();
    table.string('profilePictureUrl').nullable();
    table.string('locale').nullable();
    table.json('rawProfile').nullable(); // Store full OAuth profile for reference
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    // Constraints and indexes
    table.unique(['provider', 'providerId']); // Prevent duplicate OAuth accounts
    table.unique(['userId', 'provider']); // One OAuth account per provider per user
    table.index(['provider', 'email']); // OAuth lookup by provider and email
  });

  // Friendships Table
  await knex.schema.createTable('friendships', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('friendId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('status').notNullable().defaultTo('pending'); // 'pending', 'accepted', 'blocked'
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // Friend request sent
    table.timestamp('acceptedAt').nullable(); // Friend request accepted
    
    // Constraints and indexes
    table.unique(['userId', 'friendId']); // Prevent duplicate friend requests
    table.index(['userId', 'status']); // User's friend requests by status
    table.index(['friendId', 'status']); // Incoming friend requests
    table.index(['status', 'createdAt']); // Recent friend requests
    
    // Prevent self-friendship
    table.check('user_id != friend_id');
  });

  console.log('Created OAuth and social tables: oauthProfiles, friendships');
  console.log('Finished migration: 20250913000002_add_oauth_integration.ts');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('friendships');
  await knex.schema.dropTableIfExists('oauthProfiles');
}
```

**File**: `database/migrations/20250913000003_enhance_progress_tracking.ts`
```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Starting migration: 20250913000003_enhance_progress_tracking.ts');

  // Enhance existing userProgress table with social and gamification fields
  await knex.schema.alterTable('userProgress', (table) => {
    table.integer('weeklyXp').notNullable().defaultTo(0);
    table.integer('monthlyXp').notNullable().defaultTo(0);
    table.integer('bestStreak').notNullable().defaultTo(0);
    table.string('rank').notNullable().defaultTo('Beginner'); // 'Beginner', 'Intermediate', 'Advanced', 'Expert'
    table.integer('leaderboardRank').nullable(); // Current weekly leaderboard position
    table.date('lastXpResetDate').defaultTo(knex.raw("date('now')")); // Track XP reset dates
  });

  // Create XP Activities Log Table (for detailed tracking and analytics)
  await knex.schema.createTable('xpActivities', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('activityType').notNullable(); // 'lesson_completion', 'daily_goal', 'streak_bonus', etc.
    table.integer('xpAmount').notNullable();
    table.string('sourceId').nullable(); // lessonId, goalId, etc. for reference
    table.json('metadata').nullable(); // Additional context (score, time, etc.)
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    
    // Indexes for analytics and leaderboard queries
    table.index(['userId', 'createdAt']); // User's XP timeline
    table.index(['activityType', 'createdAt']); // XP by activity type
    table.index(['createdAt']); // Daily/weekly XP aggregation
  });

  // Weekly Leaderboard Snapshots (for performance and historical data)
  await knex.schema.createTable('weeklyLeaderboards', (table) => {
    table.increments('id').primary();
    table.date('weekStartDate').notNullable(); // Monday of the week
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('weeklyXp').notNullable();
    table.integer('rank').notNullable();
    table.timestamp('calculatedAt').defaultTo(knex.fn.now());
    
    // Constraints and indexes
    table.unique(['weekStartDate', 'userId']); // One entry per user per week
    table.index(['weekStartDate', 'rank']); // Leaderboard queries
    table.index(['userId', 'weekStartDate']); // User's leaderboard history
  });

  console.log('Enhanced userProgress table and created XP tracking tables');
  console.log('Finished migration: 20250913000003_enhance_progress_tracking.ts');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('weeklyLeaderboards');
  await knex.schema.dropTableIfExists('xpActivities');
  
  // Remove added columns from userProgress
  await knex.schema.alterTable('userProgress', (table) => {
    table.dropColumn('weeklyXp');
    table.dropColumn('monthlyXp');
    table.dropColumn('bestStreak');
    table.dropColumn('rank');
    table.dropColumn('leaderboardRank');
    table.dropColumn('lastXpResetDate');
  });
}
```

### 2. Database Seed Data (NEW)

**File**: `database/seeds/03_gamification_data.ts`
```typescript
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing gamification data
  await knex('userBadges').del();
  await knex('badges').del();

  // Insert default badges
  await knex('badges').insert([
    // Streak Badges
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first French lesson',
      iconUrl: '/icons/badges/first-lesson.svg',
      category: 'achievement',
      rarity: 'common',
      criteria: JSON.stringify({ lessonCount: 1 }),
      xpReward: 10
    },
    {
      id: 'week_streak_3',
      name: 'Consistency',
      description: 'Study French for 3 days in a row',
      iconUrl: '/icons/badges/streak-3.svg', 
      category: 'streak',
      rarity: 'common',
      criteria: JSON.stringify({ streakDays: 3 }),
      xpReward: 25
    },
    {
      id: 'week_streak_7',
      name: 'Dedicated Learner',
      description: 'Study French for 7 days in a row',
      iconUrl: '/icons/badges/streak-7.svg',
      category: 'streak', 
      rarity: 'rare',
      criteria: JSON.stringify({ streakDays: 7 }),
      xpReward: 50
    },
    {
      id: 'week_streak_30',
      name: 'French Master',
      description: 'Study French for 30 days in a row',
      iconUrl: '/icons/badges/streak-30.svg',
      category: 'streak',
      rarity: 'legendary',
      criteria: JSON.stringify({ streakDays: 30 }),
      xpReward: 200
    },
    
    // XP Badges
    {
      id: 'xp_milestone_100',
      name: 'Getting Started',
      description: 'Earn 100 XP',
      iconUrl: '/icons/badges/xp-100.svg',
      category: 'achievement',
      rarity: 'common',
      criteria: JSON.stringify({ totalXp: 100 }),
      xpReward: 20
    },
    {
      id: 'xp_milestone_1000',
      name: 'Committed Student',
      description: 'Earn 1,000 XP',
      iconUrl: '/icons/badges/xp-1000.svg',
      category: 'achievement',
      rarity: 'rare',
      criteria: JSON.stringify({ totalXp: 1000 }),
      xpReward: 100
    },
    
    // Social Badges
    {
      id: 'first_friend',
      name: 'Social Learner',
      description: 'Add your first friend',
      iconUrl: '/icons/badges/first-friend.svg',
      category: 'social',
      rarity: 'common',
      criteria: JSON.stringify({ friendCount: 1 }),
      xpReward: 15
    },
    
    // Skill Badges
    {
      id: 'vocabulary_master',
      name: 'Word Wizard',
      description: 'Complete 10 vocabulary lessons',
      iconUrl: '/icons/badges/vocabulary-master.svg',
      category: 'skill',
      rarity: 'rare',
      criteria: JSON.stringify({ vocabularyLessons: 10 }),
      xpReward: 75
    }
  ]);

  console.log('Seeded default badges data');
}
```

### 3. Architecture Documentation Updates

**Update File**: `docs/development_docs/architecture/database_schema.mermaid`

**Add to existing schema** (after the current tables):
```mermaid
    dailyGoals {
        string id PK "UUID format goal_YYYYMMDD_userId"
        int userId FK
        date date "YYYY-MM-DD"
        int targetXp "default: 50"
        int targetLessons "default: 3" 
        int targetMinutes "default: 20"
        int currentXp "default: 0"
        int currentLessons "default: 0"
        int currentMinutes "default: 0"
        boolean completed "default: false"
        datetime completedAt "nullable"
        datetime createdAt
        datetime updatedAt
        %% unique userId, date
    }

    badges {
        string id PK
        string name "notNull"
        text description "notNull"
        string iconUrl "notNull" 
        string category "streak|achievement|social|skill"
        string rarity "common|rare|epic|legendary"
        json criteria "notNull"
        int xpReward "default: 10"
        boolean isActive "default: true"
        datetime createdAt
        datetime updatedAt
    }

    userBadges {
        int id PK
        int userId FK
        string badgeId FK
        datetime unlockedAt "default: now"
        json metadata "nullable"
        %% unique userId, badgeId
    }

    oauthProfiles {
        int id PK
        int userId FK
        string provider "google|facebook"
        string providerId "notNull"
        string email "notNull"
        string displayName "nullable"
        string firstName "nullable"
        string lastName "nullable"
        string profilePictureUrl "nullable"
        string locale "nullable"
        json rawProfile "nullable"
        datetime createdAt
        datetime updatedAt
        %% unique provider, providerId
        %% unique userId, provider
    }

    friendships {
        int id PK
        int userId FK
        int friendId FK
        string status "pending|accepted|blocked"
        datetime createdAt
        datetime acceptedAt "nullable"
        %% unique userId, friendId
    }

    xpActivities {
        int id PK
        int userId FK
        string activityType "notNull"
        int xpAmount "notNull"
        string sourceId "nullable"
        json metadata "nullable"
        datetime createdAt
    }

    weeklyLeaderboards {
        int id PK
        date weekStartDate "Monday of week"
        int userId FK
        int weeklyXp "notNull"
        int rank "notNull"
        datetime calculatedAt
        %% unique weekStartDate, userId
    }

    %% Add relationships
    users ||--o{ dailyGoals : "sets"
    users ||--o{ userBadges : "earns"
    badges ||--o{ userBadges : "awarded_as"
    users ||--o{ oauthProfiles : "links"
    users ||--o{ friendships : "initiates"
    users ||--o{ friendships : "receives"
    users ||--o{ xpActivities : "generates"
    users ||--o{ weeklyLeaderboards : "appears_on"
```

## Dependencies

### Prerequisites
- Existing database migrations must be up to date
- Current user data and progress tracking should be backed up before migration
- Database connection must be established and tested

### Affected Systems
- **Existing Services**: No breaking changes to current services
- **Current Data**: Full backward compatibility maintained
- **API Endpoints**: No immediate changes required (new endpoints added in later phases)

### Development Dependencies
- No new packages required for Phase 1
- Uses existing Knex.js migration system
- Leverages current database configuration

## Testing Strategy

### Migration Testing
```typescript
// Test file: database/migrations/__tests__/gamification-migrations.test.ts
describe('Gamification Migrations', () => {
  test('should create all gamification tables', async () => {
    await runMigration('20250913000001_add_gamification_tables.ts');
    
    // Verify tables exist
    expect(await knex.schema.hasTable('dailyGoals')).toBe(true);
    expect(await knex.schema.hasTable('badges')).toBe(true);
    expect(await knex.schema.hasTable('userBadges')).toBe(true);
  });

  test('should maintain referential integrity', async () => {
    // Test foreign key constraints work correctly
    const userId = await createTestUser();
    const goalId = `goal_${new Date().toISOString().split('T')[0]}_${userId}`;
    
    await expect(
      knex('dailyGoals').insert({ id: goalId, userId: 999, date: '2025-09-13' })
    ).rejects.toThrow(); // Should fail - user doesn't exist
  });
});
```

### Data Integrity Testing  
- Verify existing user data remains unchanged
- Test cascade deletion works correctly
- Validate index creation for performance
- Ensure unique constraints prevent duplicate data

## Review Points

### Critical Review Areas
1. **Data Migration Safety**: Verify no data loss during schema changes
2. **Performance Impact**: Ensure new indexes don't slow down existing queries  
3. **Referential Integrity**: Validate all foreign key relationships
4. **Storage Requirements**: Estimate storage impact of new tables
5. **Backup Strategy**: Confirm rollback plan for migration failures

### Possible Solutions Considered

**Schema Design Approach:**
- ✅ **Chosen**: Separate tables for gamification features (better normalization, cleaner queries)
- ❌ **Rejected**: JSON columns in existing tables (harder to query and index)
- ❌ **Rejected**: Single "activities" table (would become too large and complex)

**XP Tracking Strategy:**  
- ✅ **Chosen**: Separate `xpActivities` log + cached values in `userProgress` (performance + audit trail)
- ❌ **Rejected**: Only cached values (no audit trail for debugging)
- ❌ **Rejected**: Only activity log (too slow for leaderboard queries)

**Social Features Model:**
- ✅ **Chosen**: Bidirectional friendship model (matches user expectations)
- ❌ **Rejected**: Following/follower model (less suitable for learning context)
- ❌ **Rejected**: Single friendship table (harder to query mutual connections)

## Success Criteria

### Functional Requirements Met
- [ ] All migrations run successfully without data loss
- [ ] Foreign key relationships properly established
- [ ] Indexes created for optimal query performance
- [ ] Seed data populates correctly
- [ ] Backward compatibility with existing user data maintained

### Performance Benchmarks
- Migration execution time < 30 seconds for databases with 10k+ users
- New indexes improve query performance by >50% for social/leaderboard queries
- Database size increase < 15% compared to current schema

### Quality Gates
- All migration tests pass
- Database schema documentation updated
- Rollback procedures tested and documented
- Performance impact assessed and acceptable

---

**Next Phase**: [Phase 2: Gamification Infrastructure](./phase-2-gamification-infrastructure.md)
**Dependencies for Next Phase**: All Phase 1 migrations successfully applied
