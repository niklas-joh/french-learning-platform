/**
 * Authentication controller.
 *
 * Handles registration, login, and authentication validation logic. Issues JWT tokens 
 * that are later consumed by the auth middleware. Follows Single Responsibility Principle
 * by focusing purely on authentication concerns (not user management).
 * 
 * Updated to use centralized authentication types and improved error handling.
 * Follows development principles: type safety, performance optimization, and clean architecture.
 * 
 * @fileoverview Authentication controller with centralized types and comprehensive logging
 * @since 2025-01-28 - Updated to use centralized auth types and remove duplicate declarations
 */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { JWTPayload, AuthValidationResponse } from '../types/auth.types.js';
import { getUserByEmail, createUser, getInternalUserByEmailWithPassword, UserApplicationData } from '../models/User.js';
import { progressService } from '../services/progressService.js';

/**
 * Registers a new user and returns a JWT token.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists using the public-facing getUserByEmail
    const existingUserPublic = await getUserByEmail(email);
    if (existingUserPublic) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // TODO: enforce password strength requirements before hashing.

    // Create user
    // The createUser function now expects camelCase properties
    const createdUser: UserApplicationData = await createUser({
      email,
      passwordHash: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      role: 'user'
    });

    // Initialize user progress
    await progressService.initializeUserProgress(createdUser.id);

    // Generate minimal JWT (performance optimized - only authentication data)
    const jwtPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role
    };
    
    const token = jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { // Return UserApplicationData structure
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Validates user credentials and returns a JWT token on success.
 * 
 * Enhanced with comprehensive logging to debug the reported 500 Internal Server Error.
 * Logs each step of the authentication process while maintaining security (no sensitive data).
 * 
 * @param req - Express request object containing email and password
 * @param res - Express response object
 * @returns Promise<void> - Sends JSON response with token and user data on success
 * 
 * @throws 401 - Invalid credentials (user not found or wrong password)
 * @throws 500 - Server configuration error or unexpected database/hashing issues
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  console.log('🔍 Login attempt initiated:', {
    timestamp: new Date().toISOString(),
    email: req.body.email,
    hasPassword: !!req.body.password,
    passwordLength: req.body.password?.length || 0
  });

  try {
    const { email, password } = req.body;

    // Input validation logging
    if (!email || !password) {
      console.log('❌ Missing credentials:', { email: !!email, password: !!password });
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    console.log('📧 Attempting to fetch user from database:', email);
    
    // Find user internally to get passwordHash
    const internalUser = await getInternalUserByEmailWithPassword(email);
    
    console.log('👤 User lookup result:', {
      userFound: !!internalUser,
      userId: internalUser?.id || null,
      hasPasswordHash: !!internalUser?.passwordHash,
      passwordHashLength: internalUser?.passwordHash?.length || 0
    });

    if (!internalUser) {
      console.log('❌ Authentication failed: User not found in database');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!internalUser.passwordHash) {
        // This case should ideally not happen if user creation enforces passwordHash
        console.error(`💥 Critical: User ${internalUser.email} (ID: ${internalUser.id}) has no passwordHash.`);
        res.status(500).json({ message: 'User account configuration error.' });
        return;
    }
    
    console.log('🔒 Starting password comparison with bcrypt');
    
    // Check password with enhanced error handling
    let isValidPassword: boolean;
    try {
      isValidPassword = await bcrypt.compare(password, internalUser.passwordHash);
      console.log('✅ Password comparison completed:', { isValid: isValidPassword });
    } catch (bcryptError) {
      const errorMessage = bcryptError instanceof Error ? bcryptError.message : String(bcryptError);
      const errorStack = bcryptError instanceof Error ? bcryptError.stack : undefined;
      console.error('💥 bcrypt.compare failed:', {
        error: errorMessage,
        stack: errorStack,
        hashProvided: !!internalUser.passwordHash,
        passwordProvided: !!password
      });
      throw new Error('Password verification failed');
    }
    
    if (!isValidPassword) {
      console.log('❌ Authentication failed: Invalid password for user:', internalUser.email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('👍 User authenticated successfully, preparing response data');

    // User is valid, prepare application data for JWT and response
    const userForResponse: UserApplicationData = {
        id: internalUser.id!,
        email: internalUser.email,
        firstName: internalUser.firstName,
        lastName: internalUser.lastName,
        role: internalUser.role || 'user',
        createdAt: internalUser.createdAt!,
        preferences: internalUser.preferences ? JSON.parse(internalUser.preferences) : null
    };

    console.log('🎫 Generating JWT token with payload:', {
      userId: userForResponse.id,
      email: userForResponse.email,
      role: userForResponse.role,
      jwtSecretConfigured: !!(process.env.JWT_SECRET || 'test_secret')
    });

    // Generate minimal JWT with enhanced error handling (performance optimized)
    let token: string;
    try {
      const jwtPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: userForResponse.id,
        email: userForResponse.email,
        role: userForResponse.role
      };
      
      token = jwt.sign(
        jwtPayload,
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '24h' }
      );
      console.log('✅ Minimal JWT token generated successfully');
    } catch (jwtError) {
      const errorMessage = jwtError instanceof Error ? jwtError.message : String(jwtError);
      const errorStack = jwtError instanceof Error ? jwtError.stack : undefined;
      console.error('💥 JWT generation failed:', {
        error: errorMessage,
        stack: errorStack
      });
      throw new Error('Token generation failed');
    }

    console.log('🎉 Login successful for user:', {
      userId: userForResponse.id,
      email: userForResponse.email,
      role: userForResponse.role
    });

    res.json({
      message: 'Login successful',
      token,
      user: { // Return UserApplicationData structure
        id: userForResponse.id,
        email: userForResponse.email,
        firstName: userForResponse.firstName,
        lastName: userForResponse.lastName,
        role: userForResponse.role
      }
    });
  } catch (error) {
    // Enhanced error logging following development principles
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
    
    console.error('💥 Login error details:', {
      message: errorMessage,
      stack: errorStack,
      email: req.body.email,
      timestamp: new Date().toISOString(),
      errorType: errorType,
      // Don't log password for security
      requestHeaders: {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']?.substring(0, 50) // Truncate for logs
      }
    });
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Validates authentication token and returns basic authentication information.
 * 
 * This endpoint follows Single Responsibility Principle (SRP) by only handling
 * authentication validation concerns. It does NOT return full user profile data
 * (that's the responsibility of /users/me endpoint).
 * 
 * Performance optimized: No database calls needed since JWT validation is handled
 * by middleware. Returns data directly from the validated token payload.
 * Uses centralized AuthValidationResponse type for consistency.
 * 
 * @param {Request} req - Authenticated request with user data attached by protect middleware
 * @param {Response} res - Express response object
 * @returns {void} JSON response with authentication status and basic token information
 * 
 * @throws {401} User not authenticated - if protect middleware failed to populate req.user
 * 
 * @example
 * Response format (AuthValidationResponse):
 * {
 *   "success": true,
 *   "userId": 123,
 *   "email": "user@example.com",
 *   "role": "user",
 *   "tokenValid": true,
 *   "message": "Authentication token is valid"
 * }
 * 
 * @since 2025-01-28 - Updated to use centralized types and improved validation
 */
export const validateToken = (req: Request, res: Response): void => {
  // At this point, the protect middleware has already validated the JWT token
  // and attached the minimal user data to req.user. No additional validation needed.
  
  // Safety check - this should not happen if protect middleware works correctly
  if (!req.user?.userId) {
    console.error('validateToken called without user data:', {
      hasUser: !!req.user,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']?.substring(0, 50)
    });
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  
  // Return minimal authentication information following centralized types
  const response: AuthValidationResponse = {
    success: true,
    userId: req.user.userId,
    email: req.user.email || '',
    role: req.user.role || 'user',
    tokenValid: true,
    message: 'Authentication token is valid'
  };
  
  res.json(response);
};
