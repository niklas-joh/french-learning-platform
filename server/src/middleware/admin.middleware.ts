/**
 * Simple middleware to guard routes that require an admin role.
 */
import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

// TODO: replace the ts-ignore above once Express types allow augmenting Request
