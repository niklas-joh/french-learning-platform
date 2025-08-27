# SUBTASK 01: Database Table Name Mismatch Fixes

## Issue Summary
**Critical Blocking Issue**: Server code uses snake_case table names (`learning_paths`, `learning_units`) but database migrations create camelCase tables (`learningPaths`, `learningUnits`), causing `SQLITE_ERROR: no such table` errors.

## Impact Assessment
- **Severity**: CRITICAL - Blocks 4+ API endpoints
- **Affected Endpoints**: All learning path and curriculum endpoints
- **Error Pattern**: `SQLITE_ERROR: no such table: learning_paths`
- **User Impact**: AI Dashboard completely non-functional, 500 errors on key features

## Root Cause Analysis
Database migration `20250625000000_create_core_learning_tables.ts` creates:
- `learningPaths` table (camelCase)
- `learningUnits` table (camelCase)

Server code queries:
- `learning_paths` (snake_case) - **INCORRECT**
- `learning_units` (snake_case) - **INCORRECT**

## Development Principles Compliance
Following `docs/development_docs/development_principles.md`:
- ✅ **Maintain camelCase database naming convention**
- ✅ **Update server code to match established schema**
- ❌ **DO NOT change database schema** (would violate project conventions)

## Files Requiring Updates

### 1. server/src/models/LearningPath.ts
**Current Problematic Code**:
```typescript
// INCORRECT - table doesn't exist
await db('learning_paths')
```

**Required Fix**:
```typescript
// CORRECT - matches migration table name
await db('learningPaths')
```

**Review Points**:
- Check all database query methods in this file
- Verify JOIN operations use correct table names
- Update any table aliases if needed

### 2. server/src/models/LearningUnit.ts  
**Current Problematic Code**:
```typescript
// INCORRECT - table doesn't exist
db('learning_units as lu')
```

**Required Fix**:
```typescript
// CORRECT - matches migration table name
db('learningUnits as lu')
```

**Review Points**:
- Update table aliases throughout the file
- Check for any foreign key references
- Verify relationship mappings use correct names

### 3. server/src/services/learningPathService.ts
**Expected Multiple Corrections** (requires file reading for exact locations):
- All `learning_paths` references → `learningPaths`
- All `learning_units` references → `learningUnits`
- Any JOIN operations between these tables

**Review Points**:
- Check service methods that query both tables
- Verify cached query patterns
- Update any raw SQL strings if present

### 4. server/src/models/Lesson.ts
**Expected Corrections**:
- References to `learning_units` table → `learningUnits`
- Any foreign key relationships with learning units

## Additional Files That May Need Updates

### Potential Database-Related Files:
1. **server/src/repositories/LearningPathRepository.ts** (if exists)
   - Likely contains repository pattern queries with snake_case

2. **Database seed files**:
   - `database/seeds/00_core_data.ts` - Check for hardcoded table references
   - `database/seeds/06_learning_content.ts` - May reference these tables

3. **Test files**:
   - Any `*.test.ts` files with hardcoded table names
   - Mock data that references these tables

## Implementation Strategy

### Step 1: File Discovery and Analysis
```bash
# Search for all snake_case references
grep -r "learning_paths" server/src/
grep -r "learning_units" server/src/
```

### Step 2: Systematic Updates
1. Read each identified file completely
2. Update all snake_case table references to camelCase
3. Verify JOIN operations and aliases
4. Test each file individually

### Step 3: Validation
```bash
# Test specific endpoints after each fix
curl -X GET "http://localhost:3001/api/v1/ai/curriculum/daily-plan/1" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## Risk Assessment

### Low Risk:
- Simple string replacement operations
- Following established project conventions
- No data migration required

### Mitigation Strategies:
- Update one file at a time
- Test each change individually
- Keep backup of original files
- Validate database schema remains unchanged

## Success Criteria
- ✅ All `SQLITE_ERROR: no such table` errors resolved
- ✅ Learning path endpoints return 200 status codes
- ✅ AI curriculum endpoints functional
- ✅ No database schema changes required
- ✅ Maintains project camelCase naming convention

## Dependencies
- **Blocks**: SUBTASK_03 (GET endpoint validation) - needs these database fixes first
- **Prerequisites**: Database must be initialized with existing migrations
- **Testing**: Requires API endpoint testing after implementation

## Documentation Updates Required
- Update system architecture diagram if it shows incorrect table names
- Verify database schema documentation reflects actual table names
- Update any API documentation examples
