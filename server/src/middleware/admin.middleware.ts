import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
    // Add any other properties you expect in the decoded token
  };
}

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Assumes authMiddleware has already run and populated req.user
  if (!req.user) {
    // This case should ideally be caught by authMiddleware first
    res.status(401).json({ message: 'Authentication required. No user found on request.' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden. Admin access required.' });
    return;
  }

  next(); // User is an admin, proceed to the next handler
};
