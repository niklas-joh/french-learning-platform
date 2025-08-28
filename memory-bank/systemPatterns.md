# System Patterns: French Learning Platform Architecture

## Overall Architecture Philosophy

The platform follows a **Service-Oriented Architecture** with clear separation between frontend presentation, backend business logic, and data persistence. The system emphasizes modularity, testability, and scalability through well-defined interfaces and dependency injection patterns.

## Backend Architecture Patterns

### Core Service Layer Structure
The backend follows a **layered architecture** with distinct responsibility boundaries:

```
Controllers → Services → Models → Database
     ↓
Routes ← Middleware ← Authentication
```

### AI Services Architecture
The AI integration follows a sophisticated **orchestration pattern** with supporting services:

**AIOrchestrator** - Central coordination hub for all AI operations
- Manages context loading and prompt generation
- Coordinates between different AI service providers
- Handles caching, rate limiting, and fallback strategies

**Assessment Engine** - Specialized AI assessment with strategy pattern
- **BatchAssessmentProcessor**: Handles large-scale assessment processing
- **AssessmentStrategyFactory**: Creates appropriate assessment strategies
- **WeaknessAnalysisService**: Asynchronous analysis of learning gaps
- **Strategy Implementations**: MultipleChoice, FillInBlank, OpenEnded, Pronunciation, Conversation

**Content Generation Engine** - Dynamic content creation pipeline
- **DynamicContentGenerator**: Core content generation orchestrator
- **ContentValidatorFactory/ContentEnhancerFactory**: Strategy patterns for content processing
- **DatabaseJobQueueService**: Asynchronous job processing for content generation

### Key Design Patterns in Use

#### 1. Factory Pattern
Used extensively for service instantiation and strategy selection:
```typescript
// Example: Assessment service factory
assessmentServiceFactory.getAssessmentAnalyticsService()
assessmentServiceFactory.createAssessmentServices()
```

#### 2. Strategy Pattern
Implemented for different content types and assessment methods:
```typescript
// Assessment strategies
AssessmentStrategyFactory → {
  MultipleChoiceStrategy,
  FillInBlankStrategy,
  PronunciationStrategy,
  ConversationStrategy
}
```

#### 3. Dependency Injection
Services receive dependencies through constructor injection:
```typescript
class AIOrchestrator {
  constructor(
    private cacheService: CacheService,
    private rateLimitService: RateLimitService,
    private contextService: ContextService
  )
}
```

#### 4. Service Layer Pattern
Business logic encapsulated in dedicated service classes:
- `progressService.ts` - User progress tracking and analytics
- `learningPathService.ts` - Curriculum and path management
- `aiService.ts` - AI operation coordination

## Frontend Architecture Patterns

### Component Architecture
The frontend follows **mobile-first component composition** with clear hierarchies:

```
MainLayout
├── BottomTabNavigation
└── Page Components (Home, Lessons, Practice, Progress, Profile)
    └── Feature Components
        └── UI Components
```

### State Management Patterns
- **AuthContext**: Global authentication state using React Context
- **Custom Hooks**: Feature-specific state management (useLearningPath, useAIDashboard)
- **Service Integration**: API calls through centralized service layer

### Key Frontend Patterns

#### 1. Container/Presentation Pattern
- Container components handle business logic and API calls
- Presentation components focus purely on UI rendering

#### 2. Custom Hook Pattern
Encapsulate complex state logic and API interactions:
```typescript
useLearningPath() // Manages learning path state and API calls
useAIDashboard() // Handles AI dashboard state and polling
```

#### 3. Service Layer Integration
Centralized API service with interceptors and error handling:
```typescript
ApiService → Controllers → Backend Services
```

## Data Flow Patterns

### Request Flow
```
Frontend Component → Custom Hook → API Service → Backend Route → Controller → Service Layer → Database
```

### AI Processing Flow
```
User Input → AIOrchestrator → Context Loading → AI Provider (OpenAI) → Response Processing → Cache → Frontend
```

### Assessment Flow
```
User Response → Assessment Controller → Strategy Factory → Appropriate Strategy → AI Analysis → Results Storage → Progress Update
```

## Database Integration Patterns

### Model Pattern
Database interactions follow a **model-based approach** using Knex query builder:
- Centralized query logic in model files
- Consistent error handling and validation
- Transaction support for complex operations

### Migration Strategy
- **Knex migrations** for schema evolution
- **Seed files** for initial data population
- **camelCase** naming convention throughout database and application

## Performance Patterns

### Caching Strategy
**Multi-layer caching approach**:
- **Redis**: Session data, frequently accessed content, AI responses
- **In-Memory**: Service instances via factory singleton pattern
- **Database**: Optimized queries with proper indexing

### Asynchronous Processing
**Job Queue Pattern** for resource-intensive operations:
- Content generation runs asynchronously
- Assessment analysis processed in background
- Progress updates via event-driven architecture

## Security Patterns

### Authentication Flow
**JWT-based authentication** with role-based access control:
```
Login → JWT Token → Protected Routes → Role Verification → Resource Access
```

### API Security
- Rate limiting for AI API calls
- Input validation at controller level
- Admin-only routes protected with middleware

## Error Handling Patterns

### Graceful Degradation
- **Fallback Handlers**: AI service failures don't crash the system
- **Circuit Breakers**: Prevent cascade failures in AI services
- **Error Boundaries**: Frontend error isolation and recovery

### Logging Strategy
- Structured logging for debugging and monitoring
- Error tracking with context preservation
- Performance metrics collection

## Module Organization Patterns

### Backend Structure
```
src/
├── controllers/     # Request handling
├── services/       # Business logic
│   ├── ai/        # AI-specific services
│   ├── assessment/ # Assessment engine
│   └── common/    # Shared utilities
├── models/        # Database interaction
├── routes/        # Route definitions
└── types/         # TypeScript definitions
```

### Frontend Structure
```
src/
├── components/    # Reusable UI components
├── pages/        # Top-level route components
├── hooks/        # Custom React hooks
├── services/     # API integration
├── context/      # Global state
└── types/        # TypeScript definitions
```

## Integration Patterns

### External Service Integration
- **OpenAI API**: Centralized through AIOrchestrator
- **Database**: Through service layer abstraction
- **Caching**: Redis integration via dedicated service

### Frontend-Backend Communication
- **RESTful APIs**: Standard HTTP methods and status codes
- **TypeScript Interfaces**: Shared types between frontend and backend
- **Error Handling**: Consistent error response format

This architecture provides the foundation for scalable, maintainable AI-powered language learning features while maintaining clear separation of concerns and testability.
