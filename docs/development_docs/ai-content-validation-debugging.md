# AI Content Validation Debugging Guide

This document outlines the enhanced logging system added to debug AI content validation failures.

## New Debug Logging Points

### 1. ContentGenerationJobHandler.ts

**[AI_DEBUG] Generated prompt for AI request**
- Shows the prompt being sent to AI
- Includes prompt length and preview
- Template and context information

**[AI_DEBUG] Raw AI response received** 
- Logs exact AI response structure and content
- Shows field names, data types, and structure
- Includes response sample for inspection
- Token usage information

**[STRUCTURE_DEBUG] Content before/after structuring**
- Logs content transformation during structuring
- Shows field mappings and type changes  
- Identifies structure mismatches

**[VALIDATION_DEBUG] Content being validated**
- Shows content structure sent to validator
- Logs validator type and configuration

**[VALIDATION_DEBUG] Validation completed**
- Detailed validation results with scores
- Lists all issues and suggestions
- Shows required vs missing fields

### 2. ContentValidator.ts

**[CONTENT_VALIDATOR_DEBUG] Starting validation**
- Initial validation attempt details
- Content type and structure overview

**[CONTENT_VALIDATOR_DEBUG] Rule completed**
- Individual validation rule results
- Rule scores, issues, and suggestions
- Processing time per rule

**[CONTENT_VALIDATOR_DEBUG] Lesson structure analysis**
- Detailed lesson-specific validation
- Section and vocabulary checking
- Field-by-field analysis

### 3. AIOrchestrator.ts

**[AI_ORCHESTRATOR_DEBUG] AI request configuration**
- AI model and prompt configuration
- Provider selection details

**[AI_ORCHESTRATOR_DEBUG] Raw AI response received**
- Unprocessed AI response
- JSON parsing status

**[AI_ORCHESTRATOR_DEBUG] AI response parsed successfully**
- Structured response analysis
- Object field mapping

## Log Search Patterns

To track a specific content generation issue:

```bash
# Follow a specific user's content generation
grep "userId.*USER_ID" server.log | grep "\[.*_DEBUG\]"

# Track validation failures
grep "\[VALIDATION_DEBUG\].*failed" server.log

# See AI response structure issues  
grep "\[AI_DEBUG\].*Raw AI response" server.log

# Monitor lesson structure problems
grep "\[CONTENT_VALIDATOR_DEBUG\].*lesson" server.log
```

## Common Validation Issues to Look For

### 1. Missing Required Fields
Look for logs showing:
- `missingFields: ['title', 'description', ...]`
- `contentKeys` vs `requiredFields` mismatch

### 2. Structure Mismatches  
Check for:
- `sections` not being an array
- `vocabulary` missing or wrong type
- `learningObjectives` not array

### 3. AI Response Problems
Monitor:
- JSON parsing errors
- Empty or null responses
- Wrong content types returned

### 4. Content Type Validation
Watch for:
- `isLesson()` check failures
- Content type specific field issues
- Validation rule score patterns

## Debugging Workflow

1. **Identify failing job**: Look for `Content validation failed` errors
2. **Find AI response**: Search for `[AI_DEBUG] Raw AI response` for that user/job
3. **Check structuring**: Look for `[STRUCTURE_DEBUG]` logs to see transformations
4. **Analyze validation**: Review `[VALIDATION_DEBUG]` logs for specific failures
5. **Check rules**: Examine individual rule results in validator logs

## Expected Log Volume

The enhanced logging will significantly increase log volume during content generation:
- ~10-15 additional log entries per content generation
- Detailed structure dumps (limited to 500-1000 chars)
- Rule-by-rule validation results

Monitor disk space and consider log rotation policies.

## Performance Impact

Minimal performance impact expected:
- JSON.stringify operations limited by size caps
- Logging is async and non-blocking
- Structure analysis uses shallow inspection

## Production Considerations

For production deployment:
- Consider log level filtering (INFO vs DEBUG)
- Implement log aggregation for analysis
- Set up alerts for validation failure patterns
- Monitor log storage requirements

## Next Steps

After implementing these logs:
1. Monitor validation failure patterns
2. Identify most common AI response issues
3. Refine validation rules based on actual AI output
4. Optimize prompts based on successful/failed patterns
5. Create automated alerts for critical validation failures
