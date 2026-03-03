/**
 * Custom Hooks
 * Reusable logic for authentication, storage, and other functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthService } from '../services/AuthService.js';
import { WatchlistService, WatchHistoryService } from '../services/WatchlistService.js';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage.js';

/**
 * useAuth - Handle authentication logic
 * @returns {Object} - Auth state and functions
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
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
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
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
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
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
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };
};

/**
 * useLocalStorage - Handle localStorage operations
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = getStorageItem(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      setStorageItem(key, valueToStore);
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * useWatchlist - Handle watchlist operations
 * @param {string} userId - User ID
 * @returns {Object} - Watchlist state and functions
 */
export const useWatchlist = (userId) => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load watchlist on mount
  useEffect(() => {
    if (userId) {
      setWatchlist(WatchlistService.getWatchlist(userId));
    }
  }, [userId]);

  const addToWatchlist = useCallback((videoId) => {
    if (!userId) return { success: false, error: 'User not authenticated' };

    const result = WatchlistService.addToWatchlist(userId, videoId);
    if (result.success) {
      setWatchlist(WatchlistService.getWatchlist(userId));
      setError(null);
    } else {
      setError(result.error);
    }
    return result;
  }, [userId]);

  const removeFromWatchlist = useCallback((watchlistId) => {
    if (!userId) return { success: false, error: 'User not authenticated' };

    const result = WatchlistService.removeFromWatchlist(userId, watchlistId);
    if (result.success) {
      setWatchlist(WatchlistService.getWatchlist(userId));
      setError(null);
    } else {
      setError(result.error);
    }
    return result;
  }, [userId]);

  const isInWatchlist = useCallback((videoId) => {
    return WatchlistService.isInWatchlist(userId, videoId);
  }, [userId]);

  return {
    watchlist,
    isLoading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    count: watchlist.length
  };
};

/**
 * useDebounce - Debounce a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useFetch - Handle API calls
 * @param {Function} fetchFunction - Async function to call
 * @param {any} initialData - Initial data value
 * @returns {Object} - Data, loading, error states
 */
export const useFetch = (fetchFunction, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction]);

  return { data, isLoading, error, fetchData };
};

/**
 * useAsyncEffect - Run async effect
 * @param {Function} effect - Async function
 * @param {Array} dependencies - Dependencies array
 */
export const useAsyncEffect = (effect, dependencies = []) => {
  useEffect(() => {
    let isMounted = true;

    const exec = async () => {
      try {
        await effect();
      } catch (error) {
        if (isMounted) {
          console.error('Async effect error:', error);
        }
      }
    };

    exec();

    return () => {
      isMounted = false;
    };
  }, dependencies);
};

/**
 * usePrevious - Get previous value
 * @param {any} value - Current value
 * @returns {any} - Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * useClickOutside - Detect clicks outside element
 * @param {Function} callback - Callback function
 * @returns {Object} - Ref to attach to element
 */
export const useClickOutside = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

/**
 * useFormInput - Handle form input state
 * @param {string} initialValue - Initial value
 * @returns {Object} - Input state and methods
 */
export const useFormInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const bind = {
    value,
    onChange: (e) => setValue(e.target.value)
  };

  const reset = () => setValue(initialValue);

  return [value, bind, reset];
};

/**
 * useForm - Manage form state
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} - Form state and methods
 */
export const useForm = (initialValues = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError
  };
};
