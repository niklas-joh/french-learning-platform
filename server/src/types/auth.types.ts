/**
 * Authentication-related TypeScript interfaces and types.
 * 
 * This module provides centralized type definitions for authentication concerns,
 * following Single Responsibility Principle by separating auth types from user profile types.
 * 
 * @fileoverview Centralized authentication types following ESM and camelCase conventions
 * @since 2025-01-28 - Created to resolve TypeScript interface conflicts and improve type safety
 */

/**
 * JWT payload structure for authentication tokens.
 * 
 * Contains minimal data required for authentication validation only.
 * Profile data should be fetched separately for performance and security.
 * 
 * @interface JWTPayload
 * @property {number} userId - Unique user identifier
 * @property {string} email - User email address for identification
 * @property {string} role - User role for authorization (user, admin, etc.)
 * @property {number} iat - JWT issued at timestamp (seconds since epoch)
 * @property {number} exp - JWT expiration timestamp (seconds since epoch)
 */
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Express Request user object attached by auth middleware.
 * 
 * This interface extends the Express Request to include user data
 * extracted from validated JWT tokens. Contains minimal authentication
 * data only - full user profile should be fetched via /users/me endpoint.
 * 
 * @interface AuthUser
 * @property {number} userId - Unique user identifier from JWT
 * @property {string} [email] - User email from JWT (optional for type safety)
 * @property {string} [role] - User role from JWT (optional for type safety)
 */
export interface AuthUser {
  userId: number;
  email?: string;
  role?: string;
}

/**
 * Authentication validation response structure.
 * 
 * Returned by /auth/me endpoint for token validation.
 * Focuses solely on authentication status and minimal token data.
 * 
 * @interface AuthValidationResponse
 * @property {boolean} success - Whether authentication validation succeeded
 * @property {number} userId - User ID from validated token
 * @property {string} email - User email from validated token
 * @property {string} role - User role from validated token
 * @property {boolean} tokenValid - Explicit token validity flag
 * @property {string} message - Human-readable validation message
 */
export interface AuthValidationResponse {
  success: boolean;
  userId: number;
  email: string;
  role: string;
  tokenValid: boolean;
  message: string;
}

/**
 * Type guard to check if decoded JWT has required properties.
 * 
 * Provides type safety when working with JWT decode results.
 * Ensures the decoded token contains all required authentication fields.
 * 
 * @param decoded - The decoded JWT payload (unknown type)
 * @returns {boolean} True if decoded token has valid structure
 * 
 * @example
 * const decoded = jwt.verify(token, secret);
 * if (isValidJWTPayload(decoded)) {
 *   // TypeScript now knows decoded has userId, email, role
 *   console.log(decoded.userId);
 * }
 */
export function isValidJWTPayload(decoded: unknown): decoded is JWTPayload {
  return (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    'email' in decoded &&
    'role' in decoded &&
    typeof (decoded as any).userId === 'number' &&
    typeof (decoded as any).email === 'string' &&
    typeof (decoded as any).role === 'string'
  );
}

/**
 * Global Express Request type extension.
 * 
 * Augments the Express Request interface to include user property
 * populated by authentication middleware. This provides type safety
 * across all controllers that use the protect middleware.
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * User data extracted from validated JWT token.
       * Populated by protect middleware after successful token validation.
       * 
       * @type {AuthUser}
       */
      user?: AuthUser;
    }
  }
}
