import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number; // Changed from id to userId for consistency
    email?: string;
    role?: string;
    // Add other properties from JWT payload if needed
  };
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log('Entering protect middleware'); // <-- ADD THIS LINE
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      // The token payload contains `userId`, not `id`.
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: number; email?: string; role?: string; /* other props from token */ };
      
      console.log('Decoded JWT payload in middleware:', decoded); // Log the entire decoded payload
      console.log('Value of decoded.userId:', decoded.userId, 'Type:', typeof decoded.userId); // Log userId and its type

      // Attach user to request object
      if (typeof decoded.userId !== 'number' || decoded.userId <= 0) {
        console.error('Invalid userId in token:', decoded.userId);
        res.status(401).json({ message: 'Not authorized, token invalid (userId)' });
        return;
      }
      // Populate req.user with details from the token
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
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
