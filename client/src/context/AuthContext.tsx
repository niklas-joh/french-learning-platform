import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types/User';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Temporary development bypass - REMOVE AFTER TESTING
  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowTestAccess = isDevelopment && window.location.search.includes('test=true');

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    console.log("Handling logout...");
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Redirect to login page after state has been cleared
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const validateTokenAndLoadUser = async () => {
      // Temporary development bypass - REMOVE AFTER TESTING
      if (allowTestAccess) {
        const mockUser: User = {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'user'
        };
        setUser(mockUser);
        setToken('test-token');
        setIsLoading(false);
        return;
      }

      if (token) {
        try {
          // Step 1: Validate authentication token (fast, minimal data)
          // Uses /auth/me endpoint for authentication validation only
          const isValid = await authService.validateToken();
          
          if (isValid) {
            // Step 2: Load complete user profile data (separate concern)
            // Uses /users/me endpoint for complete user profile
            const profile = await authService.getUserProfile();
            setUser(profile);
          } else {
            console.error("Token validation failed - invalid token");
            handleLogout();
          }
        } catch (error) {
          console.error("Authentication validation or profile loading failed:", error);
          // The token is invalid or profile loading failed, so we log out
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    validateTokenAndLoadUser();

    // Only set up auth error listener when not in test mode
    if (!allowTestAccess) {
      window.addEventListener('auth-error', handleLogout);
    }

    // Cleanup listener on component unmount
    return () => {
      if (!allowTestAccess) {
        window.removeEventListener('auth-error', handleLogout);
      }
    };
  }, [token, handleLogout, allowTestAccess]);

  const login = async (credentials: any) => {
    const { token, user } = await authService.login(credentials);
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    // This can be called manually (e.g., by a logout button)
    handleLogout();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
