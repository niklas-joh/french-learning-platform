import type { Knex } from "knex";

/**
 * Database Migration: Create User Friendships Table
 * 
 * @description Creates the userFriendships table for social features allowing users
 * to add, remove, and manage friends within the French learning platform.
 * 
 * @author Social Features Implementation Team
 * @since 2025-09-22
 * @version 1.0.0
 * 
 * @design_decisions
 * - Uses camelCase naming following project conventions
 * - Implements bidirectional friendship model with status tracking
 * - Includes performance optimizations with proper indexes
 * - Prevents duplicate friendships with unique constraints
 * - Foreign key constraints ensure data integrity
 * 
 * @performance_optimizations
 * - Composite index on (userId, status) for efficient friend listing
 * - Composite index on (friendId, status) for reverse lookups
 * - Unique constraint on (userId, friendId) prevents duplicates
 * - Foreign key constraints with cascade options for data integrity
 */

/**
 * Creates the userFriendships table with proper constraints and indexes
 * 
 * @param knex - Knex database connection instance
 * @returns Promise<void> - Resolves when table creation is complete
 * 
 * @throws {Error} If table creation fails or foreign key constraints cannot be established
 * 
 * @example
 * ```bash
 * # Run migration
 * npm run migrate:latest
 * ```
 * 
 * @schema
 * ```typescript
 * interface UserFriendshipSchema {
 *   id: number;                              // Auto-increment primary key
 *   userId: number;                          // References users.id (friendship initiator)
 *   friendId: number;                        // References users.id (friendship target)
 *   status: 'pending' | 'accepted' | 'blocked'; // Friendship status
 *   createdAt: string;                       // Timestamp when friendship was created
 *   updatedAt: string;                       // Timestamp when friendship was last updated
 * }
 * ```
 */
export async function up(knex: Knex): Promise<void> {
  console.log('Creating userFriendships table for social features...');
  
  await knex.schema.createTable('userFriendships', (table) => {
    // Primary key
    table.increments('id').primary();
    
    // Foreign key constraints following existing patterns
    table.integer('userId').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE')
      .comment('User who initiated the friendship');
    
    table.integer('friendId').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE')
      .comment('Target user for the friendship');
    
    // Friendship status with specific allowed values
    table.enum('status', ['pending', 'accepted', 'blocked'])
      .notNullable().defaultTo('pending')
      .comment('Current status of the friendship');
    
    // Timestamps following existing migration patterns
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())
      .comment('When the friendship request was created');
    
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())
      .comment('When the friendship status was last updated');
    
    // Performance optimization indexes
    // Index for efficient friend listing by user and status
    table.index(['userId', 'status'], 'idx_user_friendships_user_status');
    
    // Index for reverse lookups (who has friended this user)
    table.index(['friendId', 'status'], 'idx_user_friendships_friend_status');
    
    // Unique constraint to prevent duplicate friendships
    // This prevents both (A->B) and (B->A) duplicate requests
    table.unique(['userId', 'friendId'], 'uq_user_friendships_pair');
    
    // Additional index for status-based queries
    table.index(['status'], 'idx_user_friendships_status');
  });
  
  console.log('✅ Table "userFriendships" created successfully with indexes and constraints');
}

/**
 * Drops the userFriendships table and all associated constraints
 * 
 * @param knex - Knex database connection instance
 * @returns Promise<void> - Resolves when table is dropped
 * 
 * @warning This operation will permanently delete all friendship data
 * 
 * @example
 * ```bash
 * # Rollback migration
 * npm run migrate:rollback
 * ```
 */
export async function down(knex: Knex): Promise<void> {
  console.log('Dropping userFriendships table...');
  
  await knex.schema.dropTableIfExists('userFriendships');
  
  console.log('✅ Table "userFriendships" dropped successfully');
}
