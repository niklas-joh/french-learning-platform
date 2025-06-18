import { Request, Response, NextFunction } from 'express';
import { isAdmin } from '../admin.middleware'; // Adjust path as necessary

// Define AuthenticatedRequest for testing purposes
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email?: string;
    role?: string;
  };
}

describe('isAdmin Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  test('should call next() if user is admin', () => {
    mockRequest.user = { userId: 1, role: 'admin' };
    isAdmin(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 403 if user is not admin', () => {
    mockRequest.user = { userId: 2, role: 'user' };
    isAdmin(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: Admin access required.' });
  });

  test('should return 403 if user role is undefined', () => {
    mockRequest.user = { userId: 3 }; // Role is undefined
    isAdmin(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: Admin access required.' });
  });

  test('should return 403 if user object is undefined', () => {
    mockRequest.user = undefined;
    isAdmin(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: Admin access required.' });
  });
});
