import { ContentType } from '../types/Content';

export interface AIModelConfig {
  maxTokens: number;
  temperature: number;
  model: string;
  timeout: number;
}

// Helper to get config from environment variables with a default value
const getEnv = (key: string, defaultValue: string): string => process.env[key] || defaultValue;
const getEnvInt = (key: string, defaultValue: number): number => parseInt(getEnv(key, String(defaultValue)), 10);
const getEnvFloat = (key: string, defaultValue: number): number => parseFloat(getEnv(key, String(defaultValue)));

export const AI_CONTENT_CONFIG: Record<ContentType, AIModelConfig> = {
  lesson: {
    maxTokens: getEnvInt('AI_LESSON_MAX_TOKENS', 2000),
    temperature: getEnvFloat('AI_LESSON_TEMPERATURE', 0.7),
    model: getEnv('AI_LESSON_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_LESSON_TIMEOUT', 30000),
  },
  vocabulary_drill: {
    maxTokens: getEnvInt('AI_VOCAB_MAX_TOKENS', 1200),
    temperature: getEnvFloat('AI_VOCAB_TEMPERATURE', 0.6),
    model: getEnv('AI_VOCAB_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_VOCAB_TIMEOUT', 25000),
  },
  grammar_exercise: {
    maxTokens: getEnvInt('AI_GRAMMAR_MAX_TOKENS', 1500),
    temperature: getEnvFloat('AI_GRAMMAR_TEMPERATURE', 0.4),
    model: getEnv('AI_GRAMMAR_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_GRAMMAR_TIMEOUT', 25000),
  },
  cultural_content: {
    maxTokens: getEnvInt('AI_CULTURE_MAX_TOKENS', 1800),
    temperature: getEnvFloat('AI_CULTURE_TEMPERATURE', 0.8),
    model: getEnv('AI_CULTURE_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_CULTURE_TIMEOUT', 30000),
  },
  personalized_exercise: {
    maxTokens: getEnvInt('AI_PERSONALIZED_MAX_TOKENS', 1000),
    temperature: getEnvFloat('AI_PERSONALIZED_TEMPERATURE', 0.7),
    model: getEnv('AI_PERSONALIZED_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_PERSONALIZED_TIMEOUT', 20000),
  },
  pronunciation_drill: {
    maxTokens: getEnvInt('AI_PRONUNCIATION_MAX_TOKENS', 800),
    temperature: getEnvFloat('AI_PRONUNCIATION_TEMPERATURE', 0.5),
    model: getEnv('AI_PRONUNCIATION_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_PRONUNCIATION_TIMEOUT', 20000),
  },
  conversation_practice: {
    maxTokens: getEnvInt('AI_CONVERSATION_MAX_TOKENS', 1500),
    temperature: getEnvFloat('AI_CONVERSATION_TEMPERATURE', 0.8),
    model: getEnv('AI_CONVERSATION_MODEL', 'gpt-3.5-turbo'),
    timeout: getEnvInt('AI_CONVERSATION_TIMEOUT', 25000),
  },
};

export const DEFAULT_AI_CONFIG: AIModelConfig = {
  maxTokens: getEnvInt('AI_DEFAULT_MAX_TOKENS', 1500),
  temperature: getEnvFloat('AI_DEFAULT_TEMPERATURE', 0.7),
  model: getEnv('AI_DEFAULT_MODEL', 'gpt-3.5-turbo'),
  timeout: getEnvInt('AI_DEFAULT_TIMEOUT', 25000),
};
