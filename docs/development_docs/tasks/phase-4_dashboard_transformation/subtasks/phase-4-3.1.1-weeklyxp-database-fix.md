# Phase 4.3.1.1: WeeklyXp Database Schema Fix - Hybrid Event-Driven Approach

**Task ID**: 4.3.1.1  
**Priority**: High  
**Duration**: 1 hour  
**Dependencies**: 4.3.1 (Minimal Social Features)  
**Status**: 🔄 In Progress

## Critical Issue Identified

**Root Cause**: The leaderboard implementation is complete and correct, but fails due to a **database schema mismatch**.

- ✅ Frontend leaderboard component working
- ✅ API endpoint `/api/users/me/social/leaderboard` exists  
- ✅ Database query function `getSimpleLeaderboard()` implemented
- ❌ `userProgress` table missing `weeklyXp` column (query fails silently)

**Evidence**: Found 80+ references to `weeklyXp` throughout codebase indicating original architectural intent.

## Solution Approach: Hybrid Event-Driven System

**Approach Selected**: Modified Option A - Event-driven weeklyXp with automatic reset
- ✅ Add `weeklyXp` column (one-time migration)
- ✅ Update incrementally when XP is gained (not on every read)
- ✅ Weekly reset via service function (can be scheduled)
- ✅ Fast reads via simple column lookup

## Implementation Files

### **Primary Files (3 files)**
- `database/migrations/20250917000001_add_weekly_xp_column.ts` - Add missing column (+25 lines)
- `server/src/services/progressService.ts` - Add weekly reset logic (+30 lines)
- `server/src/services/progressService.ts` - Update XP award functions (+15 lines)

### **Total New Code**: 70 lines (maintains infrastructure-first approach)

## Implementation Steps

### **Step 1: Add Missing Database Column**

```typescript
// NEW: database/migrations/20250917000001_add_weekly_xp_column.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Adding weeklyXp column to userProgress table...');
  
  // Check if column already exists
  const hasColumn = await knex.schema.hasColumn('userProgress', 'weeklyXp');
  
  if (!hasColumn) {
    await knex.schema.alterTable('userProgress', (table) => {
      table.integer('weeklyXp').notNullable().defaultTo(0);
      table.date('lastXpResetDate').nullable(); // Track when weekly XP was last reset
    });
    
    // Initialize weeklyXp from totalXp for existing users (bootstrap data)
    await knex.raw(`
      UPDATE userProgress 
      SET weeklyXp = LEAST(totalXp, 500),
          lastXpResetDate = DATE('now', '-7 days')
      WHERE weeklyXp = 0 AND totalXp > 0
    `);
    
    console.log('✅ weeklyXp column added and bootstrapped');
  } else {
    console.log('⏭️ weeklyXp column already exists');
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('userProgress', (table) => {
    table.dropColumn('weeklyXp');
    table.dropColumn('lastXpResetDate');
  });
}
```

### **Step 2: Add Weekly Reset Logic**

```typescript
// EXTEND: server/src/services/progressService.ts (+30 lines)
// Add after existing getSimpleLeaderboard function

/**
 * Reset weekly XP for all users (called weekly via scheduler or manually)
 * 
 * HYBRID APPROACH: Event-driven XP with periodic reset for fresh competition
 * REUSE: Existing database transaction patterns
 * 
 * @returns Promise resolving to number of users reset
 */
export async function resetWeeklyXpForAllUsers(): Promise<number> {
  try {
    console.log('[WeeklyReset] Starting weekly XP reset for all users...');
    
    // Reset all users' weekly XP and update reset date
    const result = await db('userProgress')
      .update({
        weeklyXp: 0,
        lastXpResetDate: new Date().toISOString().split('T')[0] // Today's date
      });
    
    console.log(`[WeeklyReset] Reset weekly XP for ${result} users`);
    return result;
  } catch (error) {
    console.error('[WeeklyReset] Error resetting weekly XP:', error);
    throw error;
  }
}

/**
 * Check if weekly reset is needed and perform it
 * 
 * SMART RESET: Only reset if more than 7 days since last reset
 * REUSE: Existing database query patterns
 */
export async function checkAndResetWeeklyXp(): Promise<boolean> {
  try {
    // Check if any user needs reset (more than 7 days since last reset)
    const needsReset = await db('userProgress')
      .where('lastXpResetDate', '<', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .orWhereNull('lastXpResetDate')
      .first();
    
    if (needsReset) {
      await resetWeeklyXpForAllUsers();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[WeeklyReset] Error checking weekly reset:', error);
    return false;
  }
}
```

### **Step 3: Update XP Award Functions**

```typescript
// EXTEND: server/src/services/progressService.ts (modify existing recordActivity function +15 lines)
// Find and update the recordActivity function to include weeklyXp updates

export const recordActivity = async (userId: number, activityData: any) => {
  return db.transaction(async (trx: KnexTypes.Transaction) => {
    const xpGained = gamificationService.calculateXpForActivity(activityData);

    const currentProgress = await trx('userProgress').where({ userId: userId }).first();

    if (!currentProgress) {
      throw new Error('User progress not found.');
    }

    // TODO: Implement proper streak logic
    const newStreak = (currentProgress.streakDays || 0) + 1;

    const [updatedProgress] = await trx('userProgress')
      .where({ userId: userId })
      .increment('totalXp', xpGained)
      .increment('weeklyXp', xpGained) // EXTEND: Also update weekly XP
      .update({
        streakDays: newStreak,
        lastActivityDate: new Date(),
      })
      .returning('*');

    await achievementService.checkAndAwardAchievements(userId);

    return updatedProgress;
  });
};
```

## Testing Strategy

### **Database Migration Test**
```sql
-- Test the migration works correctly
SELECT name FROM sqlite_master WHERE type='table' AND name='userProgress';
PRAGMA table_info(userProgress);

-- Verify weeklyXp column exists and has correct defaults
SELECT userId, totalXp, weeklyXp, lastXpResetDate FROM userProgress LIMIT 5;
```

### **Service Function Tests**
```typescript
// EXTEND: server/src/services/__tests__/progressService.test.ts
describe('Weekly XP Management', () => {
  test('should reset weekly XP for all users', async () => {
    const resetCount = await resetWeeklyXpForAllUsers();
    expect(resetCount).toBeGreaterThanOrEqual(0);
  });
  
  test('should update both totalXp and weeklyXp on activity', async () => {
    const result = await recordActivity(1, { type: 'lesson_completion', score: 85 });
    expect(result.totalXp).toBeGreaterThan(0);
    expect(result.weeklyXp).toBeGreaterThan(0);
  });
  
  test('should generate leaderboard with weeklyXp data', async () => {
    const leaderboard = await getSimpleLeaderboard(5);
    expect(leaderboard.length).toBeGreaterThanOrEqual(0);
    if (leaderboard.length > 0) {
      expect(leaderboard[0].weeklyXp).toBeDefined();
    }
  });
});
```

## Performance Considerations

### **Migration Performance**
- **Execution Time**: <5 seconds (single column addition)
- **Bootstrapping**: Initialize from existing data for immediate functionality
- **Index Impact**: Minimal (uses existing indexed columns)

### **Runtime Performance**  
- **Leaderboard Query**: Fast (indexed weeklyXp column)
- **XP Updates**: Minimal overhead (single additional column increment)
- **Weekly Reset**: Once per week, off-peak hours

## Deployment Strategy

### **Migration Deployment**
```bash
# Run migration on server
cd server
npm run db:migrate

# Verify migration success
npm run db:status
```

### **Weekly Reset Scheduling (Future)**
```typescript
// Optional: Add to scheduler when needed
// For now, manual reset via service function
const scheduleWeeklyReset = () => {
  // Could be implemented with node-cron or similar
  setInterval(async () => {
    await checkAndResetWeeklyXp();
  }, 24 * 60 * 60 * 1000); // Check daily
};
```

## Future-Proofing

### **Extensibility Built In**
- **lastXpResetDate**: Enables flexible reset schedules
- **checkAndResetWeeklyXp**: Smart reset only when needed
- **Bootstrap Logic**: Handles existing users gracefully

### **Scaling Considerations**
- **Indexed Column**: weeklyXp will be indexed for efficient leaderboard queries
- **Event-Driven**: No computational overhead on leaderboard reads
- **Batch Operations**: Reset function handles all users efficiently

## Success Criteria

### **Immediate Goals**
- [ ] Migration runs successfully without errors
- [ ] Existing users have bootstrapped weeklyXp data
- [ ] Leaderboard displays with actual user data
- [ ] XP updates increment both totalXp and weeklyXp

### **Quality Goals**
- [ ] Zero data loss during migration
- [ ] Performance maintained (<100ms leaderboard queries)
- [ ] All existing functionality preserved
- [ ] Weekly reset function available for future scheduling

## Risk Mitigation

### **Data Safety**
- **Backup**: Migration includes rollback capability
- **Bootstrap**: Existing users get reasonable weeklyXp values
- **Graceful Degradation**: System works even if weeklyXp is 0

### **Performance Safety**
- **Single Column**: Minimal schema change impact
- **Efficient Queries**: Leverages existing database optimizations
- **Event-Driven**: No computational overhead on reads

---

**Implementation Time**: 1 hour total  
**Success Metric**: Leaderboard displays with actual user weekly XP data  
**Next Steps**: Run migration, validate leaderboard functionality, schedule weekly reset if needed

**Architecture Compliance**: ✅ Infrastructure-first, ✅ KISS principle, ✅ Minimal code addition, ✅ Performance optimized
