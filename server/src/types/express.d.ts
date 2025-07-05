declare namespace Express {
  export interface Request {
    user?: {
      userId?: number;
      id?: number;
      email?: string;
      role?: string;
    };
  }
}
