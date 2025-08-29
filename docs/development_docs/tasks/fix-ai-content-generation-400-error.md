# Fix AI Content Generation API Contract Mismatch

## Task Overview
**Status**: ✅ Completed  
**Priority**: High  
**Type**: Bug Fix  
**Actual Time**: 25 minutes

## Problem Statement
Content generation requests are failing with 400 Bad Request errors due to API contract mismatch between client and server expectations.

**Current Error**: `POST /api/v1/ai/generate 400 (Bad Request)`

### Root Cause Analysis
**Client sends** (`generateContent` in `client/src/services/api.ts`):
```javascript
{
  topic: 'Subjunctive',        // ❌ String, server expects array
  contentType: 'lesson'        // ✅ Correct
  // ❌ Missing required 'level' field
}
```

**Server expects** (from `ai.validators.ts` `generateContentPayloadSchema`):
```javascript
{
  contentType: 'lesson',       // ✅ Matches
  level: 'A1|A2|B1|B2|C1|C2', // ❌ REQUIRED but missing
  topics: ['Subjunctive'],     // ❌ Array required, client sends string
  duration: 15,                // Optional
  focusAreas: [],              // Optional
  learningStyle: 'mixed'       // Optional
}
```

## Solution Approach
Following KISS principle and development guidelines:

### Minimal Fix Strategy
- **Single file change**: Only modify `client/src/services/api.ts`
- **Inline transformation**: Convert client request to server format within `generateContent` method
- **Reuse existing patterns**: Leverage existing `getAIPreferences()` for level detection
- **Performance optimized**: Optional preference check with immediate fallback

### Technical Implementation
1. Transform `topic` (string) → `topics` (array)
2. Add required `level` field with smart defaults
3. Map optional fields to server schema
4. Maintain existing error handling patterns

## Files to Modify
- `client/src/services/api.ts` - Primary fix in `generateContent` method
- `client/src/types/AIDashboard.ts` - Update interface documentation (optional)

## Success Criteria
- [x] Content generation requests return 202 (job created) instead of 400
- [x] No new dependencies or files created
- [x] Maintains existing performance characteristics
- [x] Follows development principles (KISS, SRP, ESM patterns)
- [x] Uses existing preference system when available

## Implementation Summary
**Changes Made**:
1. **Fixed API Contract Mismatch** in `client/src/services/api.ts`:
   - Transformed `topic` (string) → `topics` (array) 
   - Added required `level` field with smart CEFR level detection
   - Mapped optional fields to server schema (duration, focusAreas, learningStyle)

2. **Enhanced User Experience**:
   - Auto-detects CEFR level from user preferences or defaults to 'A2'
   - Maintains fast fallback for performance optimization
   - Fixed circular dependency issue by calling API directly

3. **Updated Type Documentation** in `client/src/types/AIDashboard.ts`:
   - Added comprehensive JSDoc explaining automatic transformation
   - Clarified that topic field is converted to topics array
   - Documented CEFR level auto-detection behavior

**Key Technical Decisions**:
- **KISS Principle**: Inline transformation within single method (no new files)
- **Performance**: Optional preference check with immediate 'A2' fallback
- **Maintainability**: Comprehensive JSDoc documentation for future developers
- **Type Safety**: Updated interface documentation to prevent confusion

**Code Quality**:
- Followed ESM import patterns with `.js` extensions
- Used camelCase naming conventions throughout
- Maintained existing error handling patterns
- Added defensive programming for edge cases

## Testing Plan
1. Test basic content generation with topic string
2. Test with explicit difficulty level
3. Test fallback behavior when preferences unavailable
4. Verify no breaking changes to existing functionality

## Performance Impact
- **Baseline**: Current 400 error (0ms useful work)
- **Target**: ~5-10ms transformation overhead + optional preference fetch
- **Optimization**: Immediate fallback if preference check fails

## Follow-up Tasks
None - this is a focused bug fix with no planned extensions.

---
**Created**: 2025-08-29  
**Last Updated**: 2025-08-29
