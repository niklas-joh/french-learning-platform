/**
 * Express middleware for JWT authentication.
 * 
 * Validates JWT tokens and attaches minimal user data to the request object.
 * Uses centralized type definitions for consistency and type safety.
 * 
 * Performance optimized with minimal JWT payload validation and proper error handling.
 * Follows development principles: type safety, error handling, and performance focus.
 * 
 * @fileoverview JWT authentication middleware with centralized types and performance optimization
 * @since 2025-01-28 - Updated to use centralized auth types and improved validation
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/auth.types.js';
import { isValidJWTPayload } from '../types/auth.types.js';

/**
 * Authentication middleware that validates JWT tokens and populates req.user.
 * 
 * Validates Bearer tokens from Authorization header, extracts minimal user data,
 * and attaches it to the request for use in protected routes. Uses centralized
 * type definitions for consistency across the authentication system.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object  
 * @param {NextFunction} next - Express next function
 * 
 * @throws {401} Not authorized, no token - when Authorization header missing
 * @throws {401} Not authorized, token failed - when JWT verification fails
 * @throws {401} Not authorized, token invalid - when token structure is invalid
 * 
 * @example
 * // Usage in routes
 * router.get('/protected', protect, (req, res) => {
 *   // req.user is now populated with { userId, email, role }
 *   console.log(req.user.userId);
 * });
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized, malformed token' });
    return;
  }

  try {
    // Verify token with type safety
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Handle jwt.verify return type (string | JwtPayload)
    if (typeof decoded === 'string') {
      console.error('JWT verification returned string instead of payload:', {
        timestamp: new Date().toISOString()
      });
      res.status(401).json({ message: 'Not authorized, token invalid (format)' });
      return;
    }
    
    // Validate token structure using type guard
    if (!isValidJWTPayload(decoded)) {
      console.error('Invalid JWT payload structure:', {
        hasUserId: decoded && typeof decoded === 'object' && 'userId' in decoded,
        hasEmail: decoded && typeof decoded === 'object' && 'email' in decoded,
        hasRole: decoded && typeof decoded === 'object' && 'role' in decoded,
        timestamp: new Date().toISOString()
      });
      res.status(401).json({ message: 'Not authorized, token invalid (structure)' });
      return;
    }

    // Additional validation for userId
    if (typeof decoded.userId !== 'number' || decoded.userId <= 0) {
      console.error('Invalid userId in token:', {
        userId: decoded.userId,
        type: typeof decoded.userId,
        timestamp: new Date().toISOString()
      });
      res.status(401).json({ message: 'Not authorized, token invalid (userId)' });
      return;
    }

    // Attach minimal user data to request (following centralized types)
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    // TODO: Implement token revocation list for logout support
    // TODO: Add token refresh mechanism for long-running sessions

    next();
    
  } catch (error) {
    // Enhanced error logging for debugging while maintaining security
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
    
    console.error('Token verification failed:', {
      error: errorMessage,
      errorType,
      timestamp: new Date().toISOString(),
      // Don't log the actual token for security
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 10) + '...'
    });
    
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
