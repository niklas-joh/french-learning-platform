import { config } from 'dotenv';
config();

export const aiConfig = {
  // Primary AI provider (OpenAI)
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    timeout: 30000,
    maxRetries: 3,
    defaultModel: 'gpt-3.5-turbo',
    // SSL configuration for corporate environments
    sslOptions: {
      rejectUnauthorized: process.env.AI_SSL_REJECT_UNAUTHORIZED !== 'false'
    }
  },
  // Fallback AI provider (Claude)
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    timeout: 30000,
    maxRetries: 3,
    defaultModel: 'claude-3-sonnet-20240229',
    baseURL: 'https://api.anthropic.com',
    sslOptions: {
      rejectUnauthorized: process.env.AI_SSL_REJECT_UNAUTHORIZED !== 'false'
    }
  },
  // Provider selection
  provider: {
    primary: (process.env.AI_PRIMARY_PROVIDER as 'openai' | 'claude') || 'openai',
    fallbackEnabled: process.env.AI_FALLBACK_ENABLED !== 'false'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    keyPrefix: 'french-ai:',
    defaultTTL: 3600 // 1 hour
  },
  rateLimit: {
    windowMs: 60000, // 1 minute
    maxRequests: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '20')
  },
  cost: {
    budgetPerMonth: parseInt(process.env.AI_BUDGET_MONTHLY || '200'),
    alertThreshold: 0.8 // 80% of budget
  }
} as const;

export type AIConfig = typeof aiConfig;
