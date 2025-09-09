// server/src/models/AIGeneratedContent.ts

import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.js';

export interface AIGeneratedContentData {
  id: string;
  userId: number;
  type: 'lesson' | 'vocabulary_drill' | 'grammar_exercise' | 'cultural_content' | 'personalized_exercise' | 'pronunciation_drill' | 'conversation_practice';
  status: 'pending' | 'generating' | 'completed' | 'failed' | 'cached';
  requestPayload: any;
  generatedData?: any;
  validationResults?: any;
  metadata?: any;
  level?: string;
  topics?: string[];
  focusAreas?: string[];
  estimatedCompletionTime?: number;
  validationScore?: number;
  generationTimeMs?: number;
  tokenUsage?: number;
  modelUsed?: string;
  usageCount: number;
  lastAccessedAt?: string;
  expiresAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AIGeneratedContent extends Model implements AIGeneratedContentData {
  static tableName = 'aiGeneratedContent'; // ✅ Match migration camelCase

  // Properties
  id!: string;
  userId!: number;
  type!: 'lesson' | 'vocabulary_drill' | 'grammar_exercise' | 'cultural_content' | 'personalized_exercise' | 'pronunciation_drill' | 'conversation_practice';
  status!: 'pending' | 'generating' | 'completed' | 'failed' | 'cached';
  requestPayload!: any;
  generatedData?: any;
  validationResults?: any;
  metadata?: any;
  level?: string;
  topics?: string[];
  focusAreas?: string[];
  estimatedCompletionTime?: number;
  validationScore?: number;
  generationTimeMs?: number;
  tokenUsage?: number;
  modelUsed?: string;
  usageCount!: number;
  lastAccessedAt?: string;
  expiresAt?: string;
  createdAt!: Date;
  updatedAt!: Date;

  // Relationships
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'ai_generated_content.userId',
        to: 'users.id'
      }
    }
  };

  // JSON schema for validation
  static jsonSchema = {
    type: 'object',
    required: ['userId', 'type', 'status', 'requestPayload'],
    properties: {
      id: { type: ['string', 'null'], format: 'uuid' },
      userId: { type: 'integer' },
      type: { 
        type: 'string', 
        enum: ['lesson', 'vocabulary_drill', 'grammar_exercise', 'cultural_content', 'personalized_exercise', 'pronunciation_drill', 'conversation_practice']
      },
      status: { 
        type: 'string', 
        enum: ['pending', 'generating', 'completed', 'failed', 'cached']
      },
      requestPayload: { type: 'object' },
      generatedData: { type: ['object', 'null'] },
      validationResults: { type: ['object', 'null'] },
      metadata: { type: ['object', 'null'] },
      level: { type: ['string', 'null'], maxLength: 10 },
      topics: { type: ['array', 'null'] },
      focusAreas: { type: ['array', 'null'] },
      estimatedCompletionTime: { type: ['integer', 'null'], minimum: 0 },
      validationScore: { type: ['number', 'null'], minimum: 0, maximum: 100 },
      generationTimeMs: { type: ['integer', 'null'], minimum: 0 },
      tokenUsage: { type: ['integer', 'null'], minimum: 0 },
      modelUsed: { type: ['string', 'null'], maxLength: 50 },
      usageCount: { type: 'integer', minimum: 0, default: 0 },
      lastAccessedAt: { type: ['string', 'null'], format: 'date-time' },
      expiresAt: { type: ['string', 'null'], format: 'date-time' }
    }
  };

  /**
   * Objection.js hook executed before inserting a new AI generated content record.
   * Handles automatic UUID generation, data validation, and timestamp initialization.
   * 
   * This method ensures data integrity by:
   * - Auto-generating UUID v4 for primary key if not provided
   * - Validating existing UUID format if manually provided
   * - Initializing audit timestamps (createdAt, updatedAt)
   * - Setting default values for required fields
   * 
   * @throws {Error} If UUID generation fails or invalid UUID format is provided
   */
  $beforeInsert() {
    // Generate UUID v4 for primary key if not provided
    if (!this.id) {
      try {
        this.id = uuidv4();
      } catch (error) {
        throw new Error(`Failed to generate UUID for AIGeneratedContent: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Validate existing UUID format if provided
    if (this.id && !this.isValidUUID(this.id)) {
      throw new Error(`Invalid UUID format provided: ${this.id}`);
    }
    
    // Initialize audit timestamps
    this.createdAt = new Date();
    this.updatedAt = new Date();
    
    // Set default usage count if not provided
    if (!this.usageCount) {
      this.usageCount = 0;
    }
  }

  $beforeUpdate() {
    // No longer needed. The database trigger handles this automatically.
  }

  // Helper methods
  /**
   * Validates whether a given string conforms to UUID v4 format.
   * 
   * @param uuid - String to validate as UUID
   * @returns true if valid UUID v4 format, false otherwise
   * 
   * @example
   * ```typescript
   * this.isValidUUID('123e4567-e89b-12d3-a456-426614174000'); // true
   * this.isValidUUID('invalid-uuid'); // false
   * ```
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  isExpired(): boolean {
    return this.expiresAt ? new Date() > new Date(this.expiresAt) : false;
  }

  markAccessed(): void {
    this.lastAccessedAt = new Date().toISOString();
    this.usageCount += 1;
  }

  isReusable(): boolean {
    return this.status === 'completed' && !this.isExpired();
  }

  // Static methods for common queries
  static findByUserAndType(userId: number, type: string) {
    return this.query()
      .where('userId', userId)
      .where('type', type)
      .orderBy('createdAt', 'desc');
  }

  static findReusableContent(userId: number, type: string, level?: string) {
    let query = this.query()
      .where('userId', userId)
      .where('type', type)
      .where('status', 'completed')
      .where(function() {
        this.whereNull('expiresAt').orWhere('expiresAt', '>', new Date().toISOString());
      });

    if (level) {
      query = query.where('level', level);
    }

    return query.orderBy('usageCount', 'asc').orderBy('createdAt', 'desc');
  }

  static cleanup() {
    // TODO: Make retention period (24 hours) configurable via environment variables.
    const FAILED_JOB_RETENTION_MS = 24 * 60 * 60 * 1000; 

    return this.query()
      .delete()
      .where('expiresAt', '<', new Date().toISOString())
      .orWhere(function() {
        this.where('status', 'failed')
          .where('createdAt', '<', new Date(Date.now() - FAILED_JOB_RETENTION_MS));
      });
  }
}
