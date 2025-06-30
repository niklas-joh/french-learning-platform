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
    const validateToken = async () => {
      if (token) {
        try {
          // We optimistically trust the token. Let's fetch user data.
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          console.error("Initial token validation failed:", error);
          // The token is invalid, so we log out.
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    validateToken();

    // Set up the event listener for global auth errors
    window.addEventListener('auth-error', handleLogout);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('auth-error', handleLogout);
    };
  }, [token, handleLogout]);

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
