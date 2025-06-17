// server/src/middleware/admin.middleware.ts
import { Request, Response, NextFunction } from 'express';

// Define AuthenticatedRequest interface, similar to auth.middleware.ts
// as it's not exported from there.
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email?: string;
    role?: string;
  };
}

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
};
