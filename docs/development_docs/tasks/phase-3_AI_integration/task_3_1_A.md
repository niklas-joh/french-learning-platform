# Task 3.1.A: AI Orchestration Service

## **Task Information**
- **Task ID**: 3.1.A
- **Estimated Time**: 8 hours
- **Priority**: 🔥 Critical
- **Dependencies**: Authentication System, Database Setup
- **Assignee**: [To be assigned]
- **Status**: 🟡 In Progress

## **Objective**
Implement the central AI orchestration service that coordinates all AI-powered features including content generation, assessment, curriculum adaptation, and user interaction. This service acts as the intelligent brain of the platform, managing AI requests, implementing rate limiting, caching, and providing fallback mechanisms.

## **Success Criteria**
- [x] Central AI coordinator handling all AI requests
- [x] OpenAI API integration with error handling and retries
- [x] Intelligent rate limiting to prevent API cost overruns
- [x] Multi-level caching system for performance optimization
- [x] Context management for personalized AI interactions
- [x] Fallback mechanisms when AI services are unavailable
- [x] Comprehensive logging and monitoring
- [ ] Cost tracking and budget alerts
- [ ] Response time < 2 seconds for 95% of requests
- [ ] 99.9% uptime and reliability

## **Implementation Details**

### **Core Architecture**

#### **1. AI Orchestration Service**
```typescript
// server/src/services/aiOrchestrator.ts

import { OpenAI } from 'openai';
import { 
  AIRequest, 
  AIResponse, 
  OrchestrationConfig,
  CacheStrategy,
  RateLimitStrategy,
  ContextData,
  FallbackStrategy 
} from '../types/AI';
import { CacheService } from './cacheService';
import { RateLimitService } from './rateLimitService';
import { ContextService } from './contextService';
import { PromptTemplateEngine } from './promptTemplateEngine';
import { AIMetricsService } from './aiMetricsService';

export class AIOrchestrator {
  private openai: OpenAI;
  private cache: CacheService;
  private rateLimiter: RateLimitService;
  private contextService: ContextService;
  private promptEngine: PromptTemplateEngine;
  private metrics: AIMetricsService;
  private config: OrchestrationConfig;

  constructor(config: OrchestrationConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
      timeout: config.timeout || 30000,
    });
    
    this.cache = new CacheService(config.cacheConfig);
    this.rateLimiter = new RateLimitService(config.rateLimitConfig);
    this.contextService = new ContextService();
    this.promptEngine = new PromptTemplateEngine();
    this.metrics = new AIMetricsService();
  }

  async orchestrateRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    try {
      // Log incoming request
      this.metrics.logRequest(requestId, request);
      
      // Check rate limits
      await this.checkRateLimit(request.userId, request.type);
      
      // Try cache first
      const cachedResponse = await this.checkCache(request);
      if (cachedResponse) {
        this.metrics.logCacheHit(requestId);
        return this.formatResponse(cachedResponse, { fromCache: true, requestId });
      }

      // Get user context
      const context = await this.contextService.getUserContext(request.userId);
      
      // Enhance request with context
      const enhancedRequest = await this.enhanceRequest(request, context);
      
      // Execute AI request
      const aiResponse = await this.executeAIRequest(enhancedRequest);
      
      // Process and validate response
      const processedResponse = await this.processResponse(aiResponse, enhancedRequest);
      
      // Cache response if appropriate
      await this.cacheResponse(request, processedResponse);
      
      // Update context
      await this.contextService.updateContext(request.userId, request, processedResponse);
      
      // Log success metrics
      this.metrics.logSuccess(requestId, Date.now() - startTime);
      
      return this.formatResponse(processedResponse, { 
        requestId, 
        processingTime: Date.now() - startTime 
      });
      
    } catch (error) {
      console.error(`AI orchestration error for request ${requestId}:`, error);
      
      // Log error metrics
      this.metrics.logError(requestId, error, Date.now() - startTime);
      
      // Try fallback strategy
      const fallbackResponse = await this.handleFallback(request, error);
      
      return this.formatResponse(fallbackResponse, { 
        requestId, 
        fromFallback: true,
        error: error.message 
      });
    }
  }

  async generateContent(
    userId: number, 
    contentType: string, 
    parameters: any
  ): Promise<AIResponse> {
    const request: AIRequest = {
      id: this.generateRequestId(),
      userId,
      type: 'content_generation',
      subType: contentType,
      parameters,
      timestamp: new Date(),
      priority: 'normal',
    };

    return this.orchestrateRequest(request);
  }

  async assessResponse(
    userId: number, 
    userResponse: string, 
    expectedAnswer: any,
    context: any
  ): Promise<AIResponse> {
    const request: AIRequest = {
      id: this.generateRequestId(),
      userId,
      type: 'assessment',
      subType: 'response_grading',
      parameters: {
        userResponse,
        expectedAnswer,
        context,
      },
      timestamp: new Date(),
      priority: 'high',
    };

    return this.orchestrateRequest(request);
  }

  async generateCurriculumPlan(
    userId: number, 
    goals: any[], 
    timeframe: number
  ): Promise<AIResponse> {
    const request: AIRequest = {
      id: this.generateRequestId(),
      userId,
      type: 'curriculum',
      subType: 'plan_generation',
      parameters: {
        goals,
        timeframe,
      },
      timestamp: new Date(),
      priority: 'normal',
    };

    return this.orchestrateRequest(request);
  }

  async conversationTurn(
    userId: number, 
    message: string, 
    conversationContext: any
  ): Promise<AIResponse> {
    const request: AIRequest = {
      id: this.generateRequestId(),
      userId,
      type: 'conversation',
      subType: 'tutor_response',
      parameters: {
        message,
        conversationContext,
      },
      timestamp: new Date(),
      priority: 'high',
    };

    return this.orchestrateRequest(request);
  }

  // Core orchestration methods
  private async checkRateLimit(userId: number, requestType: string): Promise<void> {
    const isAllowed = await this.rateLimiter.checkLimit(userId, requestType);
    if (!isAllowed) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
  }

  private async checkCache(request: AIRequest): Promise<any> {
    const cacheKey = this.generateCacheKey(request);
    const strategy = this.getCacheStrategy(request.type);
    
    if (strategy.enabled) {
      return await this.cache.get(cacheKey);
    }
    
    return null;
  }

  private async enhanceRequest(request: AIRequest, context: ContextData): Promise<AIRequest> {
    const enhanced = { ...request };
    
    // Add user context
    enhanced.context = {
      userLevel: context.currentLevel,
      learningGoals: context.learningGoals,
      recentPerformance: context.recentPerformance,
      learningStyle: context.learningStyle,
      weakAreas: context.weakAreas,
      strengths: context.strengths,
    };

    // Add temporal context
    enhanced.temporalContext = {
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      sessionDuration: context.currentSessionDuration,
      recentActivity: context.recentActivity,
    };

    return enhanced;
  }

  private async executeAIRequest(request: AIRequest): Promise<any> {
    const prompt = await this.promptEngine.generatePrompt(request);
    const model = this.selectOptimalModel(request);
    const parameters = this.getModelParameters(request);

    const response = await this.openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      ...parameters,
    });

    return response.choices[0]?.message?.content;
  }

  private async processResponse(response: any, request: AIRequest): Promise<any> {
    try {
      // Parse JSON response if expected
      if (this.shouldParseJSON(request.type)) {
        const parsed = JSON.parse(response);
        return await this.validateResponse(parsed, request);
      }
      
      // Process text response
      return await this.processTextResponse(response, request);
    } catch (error) {
      console.error('Response processing error:', error);
      throw new Error('Failed to process AI response');
    }
  }

  private async cacheResponse(request: AIRequest, response: any): Promise<void> {
    const strategy = this.getCacheStrategy(request.type);
    
    if (strategy.enabled) {
      const cacheKey = this.generateCacheKey(request);
      const ttl = strategy.ttl || 3600; // 1 hour default
      
      await this.cache.set(cacheKey, response, ttl);
    }
  }

  private async handleFallback(request: AIRequest, error: Error): Promise<any> {
    const fallbackStrategy = this.getFallbackStrategy(request.type);
    
    switch (fallbackStrategy.type) {
      case 'static_content':
        return await this.getStaticFallback(request);
      
      case 'simplified_ai':
        return await this.executeSimplifiedAI(request);
      
      case 'cached_similar':
        return await this.getCachedSimilarResponse(request);
      
      default:
        return this.getDefaultFallback(request);
    }
  }

  // Helper methods
  private generateRequestId(): string {
    return `ai_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(request: AIRequest): string {
    const keyData = {
      type: request.type,
      subType: request.subType,
      userId: request.userId,
      parameters: request.parameters,
    };
    
    // Create hash of key data for consistent caching
    return `ai_cache_${this.hashObject(keyData)}`;
  }

  private selectOptimalModel(request: AIRequest): string {
    // Model selection based on request type and complexity
    switch (request.type) {
      case 'content_generation':
        return request.parameters?.complexity === 'high' ? 'gpt-4' : 'gpt-3.5-turbo';
      case 'assessment':
        return 'gpt-4'; // Higher accuracy needed for grading
      case 'curriculum':
        return 'gpt-4'; // Complex reasoning required
      case 'conversation':
        return 'gpt-3.5-turbo'; // Speed important for real-time chat
      default:
        return 'gpt-3.5-turbo';
    }
  }

  private getModelParameters(request: AIRequest): any {
    const baseParams = {
      max_tokens: 1000,
      temperature: 0.7,
    };

    // Adjust parameters based on request type
    switch (request.type) {
      case 'content_generation':
        return { ...baseParams, temperature: 0.8, max_tokens: 1500 };
      case 'assessment':
        return { ...baseParams, temperature: 0.3, max_tokens: 800 };
      case 'curriculum':
        return { ...baseParams, temperature: 0.6, max_tokens: 2000 };
      case 'conversation':
        return { ...baseParams, temperature: 0.8, max_tokens: 600 };
      default:
        return baseParams;
    }
  }

  private getCacheStrategy(requestType: string): CacheStrategy {
    const strategies = {
      content_generation: { enabled: true, ttl: 7200 }, // 2 hours
      assessment: { enabled: false }, // Don't cache assessments
      curriculum: { enabled: true, ttl: 86400 }, // 24 hours
      conversation: { enabled: false }, // Don't cache conversations
    };

    return strategies[requestType] || { enabled: false };
  }

  private getFallbackStrategy(requestType: string): FallbackStrategy {
    const strategies = {
      content_generation: { type: 'static_content' },
      assessment: { type: 'simplified_ai' },
      curriculum: { type: 'cached_similar' },
      conversation: { type: 'static_content' },
    };

    return strategies[requestType] || { type: 'static_content' };
  }

  private shouldParseJSON(requestType: string): boolean {
    return ['content_generation', 'curriculum', 'assessment'].includes(requestType);
  }

  private async validateResponse(response: any, request: AIRequest): Promise<any> {
    // Validate response structure based on request type
    switch (request.type) {
      case 'content_generation':
        return this.validateContentResponse(response);
      case 'assessment':
        return this.validateAssessmentResponse(response);
      case 'curriculum':
        return this.validateCurriculumResponse(response);
      default:
        return response;
    }
  }

  private validateContentResponse(response: any): any {
    if (!response.content || !response.type) {
      throw new Error('Invalid content response structure');
    }
    return response;
  }

  private validateAssessmentResponse(response: any): any {
    if (typeof response.score !== 'number' || !response.feedback) {
      throw new Error('Invalid assessment response structure');
    }
    return response;
  }

  private validateCurriculumResponse(response: any): any {
    if (!response.plan || !Array.isArray(response.activities)) {
      throw new Error('Invalid curriculum response structure');
    }
    return response;
  }

  private async processTextResponse(response: string, request: AIRequest): Promise<any> {
    // Process plain text responses
    return {
      text: response,
      type: 'text',
      confidence: 0.8, // Default confidence for text responses
    };
  }

  private formatResponse(data: any, metadata: any): AIResponse {
    return {
      success: true,
      data,
      metadata: {
        timestamp: new Date(),
        ...metadata,
      },
      cached: metadata.fromCache || false,
      fallback: metadata.fromFallback || false,
    };
  }

  private hashObject(obj: any): string {
    // Simple hash function for cache keys
    return Buffer.from(JSON.stringify(obj)).toString('base64').substr(0, 16);
  }

  // Fallback methods
  private async getStaticFallback(request: AIRequest): Promise<any> {
    // Return static fallback content based on request type
    const fallbacks = {
      content_generation: {
        content: "Continue practicing your French skills with our available exercises.",
        type: "fallback_message",
      },
      conversation: {
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        type: "fallback_response",
      },
    };

    return fallbacks[request.type] || fallbacks.conversation;
  }

  private async executeSimplifiedAI(request: AIRequest): Promise<any> {
    // Execute a simpler version of the AI request
    try {
      const simplePrompt = this.promptEngine.generateSimplePrompt(request);
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: simplePrompt }],
        max_tokens: 200,
        temperature: 0.5,
      });

      return {
        text: response.choices[0]?.message?.content,
        type: 'simplified_response',
        confidence: 0.6,
      };
    } catch (error) {
      return this.getStaticFallback(request);
    }
  }

  private async getCachedSimilarResponse(request: AIRequest): Promise<any> {
    // Try to find a similar cached response
    const similarKey = await this.cache.findSimilar(this.generateCacheKey(request));
    if (similarKey) {
      const response = await this.cache.get(similarKey);
      if (response) {
        return { ...response, type: 'similar_cached' };
      }
    }
    
    return this.getStaticFallback(request);
  }

  private getDefaultFallback(request: AIRequest): any {
    return {
      error: 'AI service temporarily unavailable',
      type: 'error_fallback',
      retryAfter: 60, // seconds
    };
  }

  // Public utility methods
  async getAIHealth(): Promise<any> {
    try {
      const testResponse = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      });

      return {
        status: 'healthy',
        latency: Date.now(),
        model: 'gpt-3.5-turbo',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }

  async getMetrics(): Promise<any> {
    return this.metrics.getMetrics();
  }

  async getCostAnalysis(): Promise<any> {
    return this.metrics.getCostAnalysis();
  }
}
```

#### **2. Cache Service**
```typescript
// server/src/services/cacheService.ts

import NodeCache from 'node-cache';

export class CacheService {
  private cache: NodeCache;
  private config: any;

  constructor(config: any) {
    this.config = config;
    this.cache = new NodeCache({
      stdTTL: config.defaultTTL || 3600, // 1 hour default
      checkperiod: 600, // Check for expired keys every 10 minutes
      useClones: false,
    });
  }

  async get(key: string): Promise<any> {
    try {
      const value = this.cache.get(key);
      if (value) {
        console.log(`Cache hit for key: ${key}`);
        return value;
      }
      console.log(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      this.cache.set(key, value, ttl || this.config.defaultTTL);
      console.log(`Cache set for key: ${key}`);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.cache.del(key);
      console.log(`Cache deleted for key: ${key}`);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async flush(): Promise<void> {
    try {
      this.cache.flushAll();
      console.log('Cache flushed');
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }

  async findSimilar(key: string): Promise<string | null> {
    // Simple implementation - in production, use more sophisticated similarity
    const keys = this.cache.keys();
    const baseKey = key.split('_').slice(0, 3).join('_'); // Get base pattern
    
    const similar = keys.find(k => k.startsWith(baseKey) && k !== key);
    return similar || null;
  }

  getStats(): any {
    return this.cache.getStats();
  }
}
```

#### **3. Rate Limiting Service**
```typescript
// server/src/services/rateLimitService.ts

export class RateLimitService {
  private limits: Map<string, any> = new Map();
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async checkLimit(userId: number, requestType: string): Promise<boolean> {
    const key = `${userId}:${requestType}`;
    const now = Date.now();
    const windowMs = this.getWindowMs(requestType);
    const maxRequests = this.getMaxRequests(requestType);

    if (!this.limits.has(key)) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    const limit = this.limits.get(key);
    
    if (now > limit.resetTime) {
      // Reset window
      limit.count = 1;
      limit.resetTime = now + windowMs;
      return true;
    }

    if (limit.count >= maxRequests) {
      return false; // Rate limit exceeded
    }

    limit.count++;
    return true;
  }

  private getWindowMs(requestType: string): number {
    const windows = {
      content_generation: 60000, // 1 minute
      assessment: 30000, // 30 seconds
      curriculum: 300000, // 5 minutes
      conversation: 10000, // 10 seconds
    };

    return windows[requestType] || 60000;
  }

  private getMaxRequests(requestType: string): number {
    const limits = {
      content_generation: 10, // 10 per minute
      assessment: 20, // 20 per 30 seconds
      curriculum: 5, // 5 per 5 minutes
      conversation: 30, // 30 per 10 seconds
    };

    return limits[requestType] || 10;
  }

  async resetLimits(userId: number): Promise<void> {
    const keysToDelete = [];
    for (const key of this.limits.keys()) {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.limits.delete(key));
  }

  getStats(): any {
    return {
      activeUsers: this.limits.size,
      totalLimits: Array.from(this.limits.values()),
    };
  }
}
```

#### **4. Context Service**
```typescript
// server/src/services/contextService.ts

import { ContextData } from '../types/AI';

export class ContextService {
  private userContexts: Map<number, ContextData> = new Map();

  async getUserContext(userId: number): Promise<ContextData> {
    if (!this.userContexts.has(userId)) {
      const context = await this.loadUserContext(userId);
      this.userContexts.set(userId, context);
    }

    return this.userContexts.get(userId)!;
  }

  async updateContext(
    userId: number, 
    request: any, 
    response: any
  ): Promise<void> {
    const context = await this.getUserContext(userId);
    
    // Update recent activity
    context.recentActivity.unshift({
      type: request.type,
      timestamp: new Date(),
      success: !!response,
    });

    // Keep only last 10 activities
    context.recentActivity = context.recentActivity.slice(0, 10);

    // Update session duration
    if (context.sessionStartTime) {
      context.currentSessionDuration = Date.now() - context.sessionStartTime.getTime();
    }

    this.userContexts.set(userId, context);
  }

  private async loadUserContext(userId: number): Promise<ContextData> {
    // In production, load from database
    return {
      userId,
      currentLevel: 'A2',
      learningGoals: [],
      recentPerformance: 0.75,
      learningStyle: 'visual',
      weakAreas: [],
      strengths: [],
      recentActivity: [],
      sessionStartTime: new Date(),
      currentSessionDuration: 0,
    };
  }

  async clearContext(userId: number): Promise<void> {
    this.userContexts.delete(userId);
  }
}
```

## **Files to Create/Modify**

### **New Files**
```
server/src/services/ai/
├── aiOrchestrator.ts           (Main orchestration service)
├── cacheService.ts             (Caching functionality)
├── rateLimitService.ts         (Rate limiting)
├── contextService.ts           (User context management)
├── promptTemplateEngine.ts     (Prompt generation)
└── aiMetricsService.ts         (Metrics and monitoring)

server/src/types/
└── AI.ts                       (AI-specific types)

server/src/controllers/
└── aiController.ts             (AI API endpoints)

server/src/routes/
└── aiRoutes.ts                 (AI routes)

server/src/config/
└── aiConfig.ts                 (AI configuration)
```

### **Files to Modify**
```
server/src/app.ts              (Add AI routes)
server/package.json            (Add OpenAI dependency)
server/src/database/           (Add AI-related tables)
.env                          (Add AI configuration)
```

## **TypeScript Types**

### **Core AI Types**
```typescript
// server/src/types/AI.ts

export interface AIRequest {
  id: string;
  userId: number;
  type: 'content_generation' | 'assessment' | 'curriculum' | 'conversation';
  subType: string;
  parameters: any;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high';
  context?: any;
  temporalContext?: any;
}

export interface AIResponse {
  success: boolean;
  data: any;
  metadata: {
    timestamp: Date;
    requestId: string;
    processingTime?: number;
    fromCache?: boolean;
    fromFallback?: boolean;
    error?: string;
  };
  cached: boolean;
  fallback: boolean;
}

export interface OrchestrationConfig {
  openaiApiKey: string;
  timeout: number;
  cacheConfig: CacheConfig;
  rateLimitConfig: RateLimitConfig;
  fallbackConfig: FallbackConfig;
}

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enabled: boolean;
}

export interface RateLimitConfig {
  enabled: boolean;
  windowMs: number;
  maxRequests: number;
}

export interface FallbackConfig {
  enabled: boolean;
  strategies: Record<string, FallbackStrategy>;
}

export interface CacheStrategy {
  enabled: boolean;
  ttl?: number;
}

export interface RateLimitStrategy {
  windowMs: number;
  maxRequests: number;
}

export interface FallbackStrategy {
  type: 'static_content' | 'simplified_ai' | 'cached_similar';
  config?: any;
}

export interface ContextData {
  userId: number;
  currentLevel: string;
  learningGoals: any[];
  recentPerformance: number;
  learningStyle: string;
  weakAreas: string[];
  strengths: string[];
  recentActivity: ActivityRecord[];
  sessionStartTime: Date;
  currentSessionDuration: number;
}

export interface ActivityRecord {
  type: string;
  timestamp: Date;
  success: boolean;
}
```

## **Testing Strategy**

### **Unit Tests**
```typescript
// server/src/tests/aiOrchestrator.test.ts

describe('AIOrchestrator', () => {
  let orchestrator: AIOrchestrator;
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    const config = createTestConfig();
    orchestrator = new AIOrchestrator(config);
    mockOpenAI = createMockOpenAI();
  });

  describe('orchestrateRequest', () => {
    it('should handle content generation requests', async () => {
      const request: AIRequest = createContentRequest();
      mockOpenAI.chat.completions.create.mockResolvedValue(
        createMockOpenAIResponse()
      );

      const response = await orchestrator.orchestrateRequest(request);
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.metadata.requestId).toBeDefined();
    });

    it('should implement rate limiting', async () => {
      const request = createContentRequest();
      
      // Make requests up to the limit
      for (let i = 0; i < 10; i++) {
        await orchestrator.orchestrateRequest(request);
      }

      // Next request should be rate limited
      await expect(
        orchestrator.orchestrateRequest(request)
      ).rejects.toThrow('Rate limit exceeded');
    });

    it('should use cache for repeated requests', async () => {
      const request = createContentRequest();
      
      // First request
      const response1 = await orchestrator.orchestrateRequest(request);
      
      // Second identical request should use cache
      const response2 = await orchestrator.orchestrateRequest(request);
      
      expect(response2.cached).toBe(true);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
    });

    it('should handle API failures with fallback', async () => {
      const request = createContentRequest();
      mockOpenAI.chat.completions.create.mockRejectedValue(
        new Error('API Error')
      );

      const response = await orchestrator.orchestrateRequest(request);
      
      expect(response.fallback).toBe(true);
      expect(response.data).toBeDefined();
    });
  });

  describe('generateContent', () => {
    it('should generate lesson content', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(
        createMockContentResponse()
      );

      const response = await orchestrator.generateContent(1, 'lesson', {
        topic: 'greetings',
        level: 'A1',
      });

      expect(response.success).toBe(true);
      expect(response.data.content).toBeDefined();
    });
  });

  describe('assessResponse', () => {
    it('should assess user responses', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(
        createMockAssessmentResponse()
      );

      const response = await orchestrator.assessResponse(
        1,
        'Bonjour',
        { correct: 'Bonjour' },
        { lesson: 'greetings' }
      );

      expect(response.success).toBe(true);
      expect(response.data.score).toBeDefined();
      expect(response.data.feedback).toBeDefined();
    });
  });
});
```

## **Review Points & Solutions**

### **🔍 Review Point 1: Cost Management**
**Concern**: OpenAI API costs could spiral out of control
**Solution**: 
- Comprehensive rate limiting per user and request type
- Intelligent caching to reduce redundant API calls
- Model selection based on complexity (cheaper models for simpler tasks)
- Real-time cost monitoring with budget alerts
- Monthly spending caps and user quotas

### **🔍 Review Point 2: Response Quality**
**Concern**: AI responses might be inconsistent or poor quality
**Solution**:
- Response validation and structure checking
- Confidence scoring for all AI outputs
- Fallback mechanisms for failed responses
- Prompt engineering with validated templates
- A/B testing for prompt optimization

### **🔍 Review Point 3: Performance & Latency**
**Concern**: AI requests might be too slow for good UX
**Solution**:
- Multi-level caching strategy
- Async processing where possible
- Model selection optimization (faster models for real-time features)
- Request batching and optimization
- Background pre-generation for predictable content

### **🔍 Review Point 4: Reliability & Uptime**
**Concern**: OpenAI API outages could break the platform
**Solution**:
- Comprehensive fallback strategies
- Static content alternatives
- Graceful degradation of AI features
- Health monitoring and automatic failover
- User communication during service issues

## **Progress Tracking**

### **Task Checklist**
- [x] **Core Orchestrator** (3 hours)
  - [x] AI orchestration service implementation
  - [x] OpenAI integration and error handling
  - [x] Request/response processing pipeline
  - [x] Model selection and parameter optimization
- [x] **Supporting Services** (3 hours)
  - [x] Cache service implementation
  - [x] Rate limiting service
  - [x] Context management service
  - [x] Metrics and monitoring service
- [ ] **Infrastructure** (2 hours)
  - [x] Configuration management
  - [x] Environment setup
  - [ ] Database integration
  - [x] API endpoints and routes

### **Success Metrics**
- [ ] Response time < 2 seconds for 95% of requests
- [ ] Cache hit rate > 70%
- [ ] API cost < $200/month for 1000 users
- [ ] 99.9% uptime and availability
- [ ] Rate limiting prevents cost overruns
- [ ] Fallback success rate > 95%

## **Next Steps**
1. Set up OpenAI API credentials and billing
2. Implement core orchestration service
3. Build supporting services (cache, rate limiting, context)
4. Create comprehensive test suite
5. Begin Task 3.1.B: Dynamic Content Generation

---

**Status**: ⏳ Ready for Implementation  
**Dependencies**: Authentication System, Database Setup  
**Estimated Completion**: 8 hours development + testing
