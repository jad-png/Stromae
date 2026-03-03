/**
 * Authentication Context
 * Provides global authentication state management
 */

import { createContext, useCallback, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService.js';
import { ERROR_MESSAGES } from '../types/index.js';

export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps application with authentication context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(ERROR_MESSAGES.UNKNOWN_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Clear expired cache periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Optional: clear expired items
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const login = useCallback((email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = AuthService.loginUser({ email, password });

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError(result.error || ERROR_MESSAGES.UNKNOWN_ERROR);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback((username, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = AuthService.registerUser({ username, email, password });

      if (result.success) {
        setError(null);
      } else {
        setError(result.error || ERROR_MESSAGES.UNKNOWN_ERROR);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      AuthService.logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
