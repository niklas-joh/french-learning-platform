/**
 * Express middleware for JWT authentication.
 *
 * If a valid token is present in the Authorization header the decoded user
 * payload is attached to the request object.
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
export interface AuthenticatedRequest extends Request { // Added export
  user?: {
    userId: number; // Changed from id to userId for consistency
    email?: string;
    role?: string;
    // Add other properties from JWT payload if needed
  };
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: number; email?: string; role?: string; };
      // TODO: implement token revocation list for logout support.
      
      // Attach user to request object
      if (typeof decoded.userId !== 'number' || decoded.userId <= 0) {
        console.error('Invalid userId in token:', decoded.userId);
        res.status(401).json({ message: 'Not authorized, token invalid (userId)' });
        return;
      }
      
      req.user = { 
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role 
      }; 

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
