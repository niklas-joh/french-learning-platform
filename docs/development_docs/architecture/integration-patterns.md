# System Integration Patterns

## Content Adapter Pattern (Added Dec 2025)

### Purpose
Provides seamless compatibility between AI-generated content formats and existing frontend component expectations without duplicating infrastructure.

### Implementation
```typescript
// client/src/utils/contentAdapter.ts
export const adaptAIContent = (content: any, contentType: string) => ({
  ...content,
  rule: content.grammarRule || content.rule, // Field mapping
  normalizedType: AI_TO_LEGACY_TYPE_MAP[contentType] || contentType // Type mapping
});
```

### Benefits
- **99% Code Reuse**: Leverages all existing components
- **<1ms Performance**: Minimal runtime overhead  
- **Future Extensible**: Easy to add new AI content types
- **Single Source of Truth**: Centralized field mappings

### Usage
Used in `DynamicLessonContent.tsx` to bridge AI content (`grammar_exercise` with `grammarRule`) and legacy components (`grammar` expecting `rule`).

### Pattern Implementation Details
- **Type Mapping**: `AI_TO_LEGACY_TYPE_MAP` converts AI content types to existing component types
- **Field Mapping**: Conditional field mapping preserves both AI and legacy field names
- **Performance**: Object spread operations with type guards ensure minimal overhead
- **Extension Points**: Comments indicate where new field mappings can be added

---

## 1. Strategy Pattern for Content Processing

The system uses the Strategy Pattern to handle different content types:

- **ContentValidatorFactory**: Selects appropriate validator based on content type
- **ContentEnhancerFactory**: Selects appropriate enhancer based on content type
- **Dynamic Selection**: Runtime selection based on ContentType enum

Benefits:
- Easy to add new content types
- Type-specific logic encapsulation
- Testable individual strategies

## 2. Factory Pattern for Service Management

ServiceFactory manages complex service dependencies:

- **Singleton Instance**: Ensures single instance of expensive services
- **Lazy Initialization**: Services created only when needed
- **Dependency Injection**: Clean separation of concerns

## 3. Template Method Pattern for Content Structure

Content structuring follows template method pattern:
- Base generation workflow in DynamicContentGenerator
- Type-specific structure methods for each content type
- Consistent processing pipeline

## 4. Fallback Pattern for Reliability

Multiple fallback mechanisms ensure reliability:
- AI service failure → Static content templates
- Validation failure → Retry with adjusted parameters
- Performance degradation → Cached content

## 5. Adapter Pattern for External Services

Clean integration with external services:
- AIOrchestrator adapts OpenAI API
- PromptTemplateEngine adapts prompt generation
- Content validators adapt different validation rules

---

# Assessment Engine Integration Patterns

## 6. Strategy Pattern for Assessment Processing

The assessment system uses comprehensive Strategy Pattern implementation:

- **AssessmentStrategyFactory**: Runtime selection of assessment strategies based on response type
- **Assessment Strategies**: 5 distinct strategies for different assessment types
- **French Language Processing**: Sophisticated language-aware assessment logic
- **Cultural Integration**: CEFR level-aware feedback with cultural context

Benefits:
- Language-specific assessment logic
- Easy extension for new assessment types
- Comprehensive French language support
- Cultural and pedagogical awareness

## 7. Batch Processing Pattern for Performance

Advanced batch processing for enterprise-scale assessment:

- **Chunking Strategy**: Configurable chunk sizes for memory optimization
- **Parallel Processing**: Concurrent assessment execution with error isolation
- **Progress Tracking**: Real-time progress monitoring with callbacks
- **Memory Management**: Intelligent batching to prevent resource exhaustion

## 8. Analytics and History Pattern

Comprehensive assessment analytics following repository pattern:

- **Assessment Recording**: Using existing database patterns and tables
- **History Retrieval**: Filtered pagination with performance optimization
- **Analytics Generation**: Response type and skill area breakdowns
- **Trend Analysis**: Progress tracking over time with personalized recommendations

## 9. Context-Aware Caching Pattern

Multi-level caching strategy for assessment optimization:

- **Assessment Result Caching**: Individual assessment result caching with TTL
- **Context Caching**: User context caching with assessment-specific optimizations
- **Batch Context Loading**: Optimized context loading for batch processing
- **Cache Invalidation**: Intelligent cache invalidation on user data changes

## 10. Service Factory Pattern for Assessment Services

Centralized dependency injection for assessment ecosystem:

- **Singleton Management**: Shared service instances across assessment components
- **Circular Dependency Resolution**: Proper initialization order for interdependent services
- **Lazy Initialization**: Services created only when needed
- **Clean Separation**: Clear boundaries between assessment services

---

# Async Processing Integration Patterns

## 11. Background Worker Pattern for Weakness Analysis (Task 3.1.C.7)

Asynchronous processing pattern for heavy analytical operations:

- **Async Job Queue**: BullMQ-based background job processing for weakness analysis
- **Cached Results**: Pre-computed analysis results stored for fast API responses
- **French Language Patterns**: Specialized linguistic pattern recognition for French learning
- **CEFR Integration**: Analysis tailored to user's French proficiency level
- **Multi-trigger System**: Analysis triggered by assessment completion thresholds and manual requests

Benefits:
- **Performance**: Moves heavy processing off synchronous API request path
- **User Experience**: Fast response times through cached analysis results
- **Scalability**: Background processing prevents API blocking during complex analysis
- **Specialized Analysis**: French-specific weakness identification (accents, gender agreement, conjugation)
- **Educational Value**: CEFR-aware feedback with pedagogical recommendations

## 12. Async Analysis Workflow Pattern

Structured workflow for background weakness analysis:

1. **Trigger Detection**: Assessment completion count or manual analysis request
2. **Job Enqueuing**: WeaknessAnalysisWorker job added to queue with user context
3. **Data Aggregation**: Recent assessment history retrieval with pattern analysis
4. **AI Processing**: Enhanced PromptTemplateEngine generates CEFR-tailored analysis prompts
5. **Result Caching**: Analysis results stored in userWeaknessAnalyses table
6. **API Response**: Fast cached result retrieval via assessment controller endpoints

## 13. Enhanced Repository Pattern for Analysis Storage

Extended repository pattern for weakness analysis data management:

- **Analysis Persistence**: `saveWeaknessAnalysis()` and `getLatestWeaknessAnalysis()` methods
- **Confidence Scoring**: Multi-factor confidence assessment based on data quality and patterns
- **Pattern Tracking**: Detailed tracking of French language mistake patterns
- **Time-based Analysis**: Configurable timeframe analysis (default 30 days)
- **Result Validation**: Zod schema validation for AI-generated analysis results
