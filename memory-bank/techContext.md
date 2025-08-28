# Technical Context: French Learning Platform Technology Stack

## Core Technology Stack

### Frontend Technologies
- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety across frontend codebase
- **Vite** - Fast development server and build tool
- **Material-UI (MUI)** - Component library for consistent design system
- **React Router** - Client-side routing for SPA navigation
- **Axios** - HTTP client with interceptors for API communication

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for API development
- **TypeScript** - Type-safe backend development
- **Knex.js** - SQL query builder and migration tool
- **PostgreSQL** - Production database (SQLite for development)
- **Jest** - Testing framework for unit and integration tests

### AI and External Services
- **OpenAI API** - Core AI service provider for language processing
- **Redis** - Caching layer for AI responses and session data
- **Vercel** - Deployment platform and hosting

## Development Standards and Configuration

### Module System Configuration
The project uses **ES Modules (ESM)** throughout:

**Key Configuration Requirements:**
```json
// package.json
{
  "type": "module"
}

// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

**Critical Import Patterns:**
- Always use `.js` extensions in import statements (even for `.ts` files)
- Example: `import { userService } from './services/userService.js'`
- Use `tsx` for execution: `tsx src/app.ts`

### Naming Conventions
- **Code**: `camelCase` for all variables, functions, and object properties
- **Database**: `camelCase` for all table and column names
- **API Responses**: `camelCase` for all JSON object keys
- **Files**: PascalCase for React components, camelCase for services and utilities

### Code Quality Tools
- **ESLint** - Linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit quality checks
- **Conventional Commits** - Structured commit message format

## AI Integration Architecture

### OpenAI Integration
**Authentication & Configuration:**
- API key management through environment variables
- Rate limiting to control costs (5 requests per minute per user)
- Request/response logging for debugging and analytics

**Cost Management:**
- Monthly budget: $200 for 1000+ active users
- Usage monitoring with automated alerts
- Intelligent caching to reduce API calls
- Model selection optimization based on task complexity

### Caching Strategy
**Multi-Level Caching:**
- **Redis**: AI responses, user sessions, frequently accessed data
- **In-Memory**: Service instances via factory singleton pattern
- **HTTP**: Browser caching for static assets

**Cache Configuration:**
- AI responses: 24-hour TTL with semantic similarity matching
- User progress: Real-time invalidation on updates
- Content data: Long-term caching with version-based invalidation

## Database Architecture

### Schema Management
- **Knex Migrations**: Version-controlled schema evolution
- **Seed Files**: Initial data population and test data
- **camelCase Naming**: Consistent throughout database and application

**Key Tables:**
```
Core Tables:
- users, user_progress, user_preferences
- learning_paths, learning_units, lessons
- content, content_types, topics

AI-Specific Tables:  
- ai_generated_content
- ai_generation_jobs
- assessment_results (planned)
```

### Performance Optimization
- **Indexes**: Optimized for common query patterns
- **Transactions**: Complex operations wrapped in database transactions
- **Connection Pooling**: Efficient database connection management

## Performance Considerations

### Frontend Performance
- **Code Splitting**: Route-based code splitting with React.lazy
- **Memoization**: Strategic use of React.memo and useMemo
- **Bundle Optimization**: Tree shaking and dead code elimination via Vite
- **Mobile Optimization**: Mobile-first responsive design

### Backend Performance
- **Factory Singleton Pattern**: Service instances cached to avoid repeated initialization
- **Async Processing**: Background jobs for AI content generation and analysis
- **Connection Pooling**: Database connection optimization
- **Response Compression**: Gzip compression for API responses

### AI Performance Optimizations
- **Response Caching**: Intelligent caching with semantic similarity
- **Request Batching**: Batch similar AI requests for efficiency
- **Circuit Breakers**: Prevent cascade failures during AI service outages
- **Fallback Strategies**: Graceful degradation when AI services are unavailable

## Development Environment Setup

### Required Tools
- **Node.js 18+** - Runtime environment
- **npm** - Package management
- **tsx** - TypeScript execution (preferred over ts-node)
- **PostgreSQL** - Database (local development)
- **Redis** - Caching layer (local development)

### Environment Configuration
**Environment Variables:**
```bash
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# AI Services
OPENAI_API_KEY=sk-...
AI_RATE_LIMIT_RPM=5

# Application
NODE_ENV=development|production
JWT_SECRET=...
PORT=3001
```

### Development Scripts
```json
{
  "dev": "nodemon --exec tsx src/app.ts",
  "build": "tsc",
  "start": "tsx src/app.ts",
  "db:migrate": "tsx node_modules/.bin/knex migrate:latest",
  "db:seed": "tsx node_modules/.bin/knex seed:run"
}
```

## Testing Strategy

### Testing Stack
- **Jest** - Primary testing framework
- **React Testing Library** - Component testing
- **Supertest** - API endpoint testing
- **MSW (Mock Service Worker)** - API mocking for tests

### Testing Patterns
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and service interactions
- **Component Testing**: React component behavior and rendering
- **E2E Testing**: Critical user flows (planned)

## Deployment and Infrastructure

### Deployment Platform
- **Vercel** - Primary hosting platform
- **Automated Deployment** - Git-based CI/CD pipeline
- **Environment Management** - Separate staging and production environments

### Production Configuration
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis cluster for high availability
- **Monitoring**: Error tracking and performance monitoring
- **Scaling**: Horizontal scaling capabilities through Vercel

## Security Implementation

### Authentication Security
- **JWT Tokens** - Stateless authentication
- **Password Hashing** - bcrypt with salt rounds
- **Role-Based Access Control** - Admin vs. user permissions
- **Session Management** - Secure token handling

### API Security
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Server-side validation for all endpoints
- **CORS Configuration** - Controlled cross-origin access
- **Environment Secrets** - Secure environment variable management

### AI Security
- **API Key Protection** - Secure OpenAI API key storage
- **Usage Monitoring** - Track and alert on unusual AI usage
- **Content Filtering** - Validate AI-generated content before serving

## Development Principles Compliance

### Code Organization
- **Service Layer Pattern** - Business logic separated from controllers
- **Factory Pattern** - Consistent service instantiation
- **Dependency Injection** - Loose coupling between components
- **Error Handling** - Comprehensive error boundaries and logging

### Performance Anti-Patterns to Avoid
- **Dynamic Imports in Hot Paths** - Use factory singletons instead
- **Mixed Module Systems** - Consistent ESM usage throughout
- **Untyped Imports** - Proper TypeScript type imports
- **Memory Leaks** - Proper cleanup and resource management

This technical foundation supports the sophisticated AI-powered learning platform while maintaining performance, security, and maintainability standards.
