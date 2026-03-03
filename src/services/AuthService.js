/**
 * Authentication Service
 * Handles user authentication, registration, and account management
 */

import { generateId } from '../utils/helpers.js';
import { setStorageItem, getStorageItem, removeStorageItem } from '../utils/storage.js';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators.js';
import { STORAGE_KEYS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../types/index.js';

// Mock users database - In production, this would be an API call with proper backend validation
let mockUsers = [
  {
    id: '1',
    username: 'demouser',
    email: 'demo@example.com',
    password: 'Demo@12345', // Hashed in production
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * Initialize mock users in storage
 */
const initializeMockUsers = () => {
  if (!getStorageItem(STORAGE_KEYS.AUTH_USER)) {
    const users = getStorageItem('users_database') || mockUsers;
    setStorageItem('users_database', users);
  }
};

/**
 * Get all users (internal use only)
 * @returns {Array} - Array of users
 */
const getAllUsers = () => {
  initializeMockUsers();
  return getStorageItem('users_database') || mockUsers;
};

/**
 * Check if user exists by email or username
 * @param {string} email - Email to check
 * @param {string} username - Username to check
 * @returns {boolean} - User exists
 */
const userExists = (email, username) => {
  const users = getAllUsers();
  return users.some(u => u.email === email || u.username === username);
};

/**
 * Find user by email
 * @param {string} email - Email to search
 * @returns {Object|null} - User object or null
 */
const findUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find(u => u.email === email) || null;
};

/**
 * Find user by username
 * @param {string} username - Username to search
 * @returns {Object|null} - User object or null
 */
const findUserByUsername = (username) => {
  const users = getAllUsers();
  return users.find(u => u.username === username) || null;
};

/**
 * Hash password (basic implementation - use bcrypt in production)
 * @param {string} password - Password to hash
 * @returns {string} - Hashed password
 */
const hashPassword = (password) => {
  // In production, use bcrypt or similar
  // This is a simple example - DO NOT USE IN PRODUCTION
  return btoa(password);
};

/**
 * Compare password with hash
 * @param {string} password - Plain password
 * @param {string} hash - Password hash
 * @returns {boolean} - Passwords match
 */
const comparePassword = (password, hash) => {
  // In production, use bcrypt.compare()
  return btoa(password) === hash;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @returns {Object} - Registration result { success, message, user?, error? }
 */
export const registerUser = (userData) => {
  // Validate inputs
  const usernameValidation = validateUsername(userData.username);
  if (!usernameValidation.isValid) {
    return {
      success: false,
      error: usernameValidation.error
    };
  }

  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      error: emailValidation.error
    };
  }

  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      error: passwordValidation.error
    };
  }

  // Check for duplicates
  if (userExists(userData.email, userData.username)) {
    return {
      success: false,
      error: ERROR_MESSAGES.DUPLICATE_USER
    };
  }

  // Create new user
  const newUser = {
    id: generateId(),
    username: userData.username.trim(),
    email: userData.email.trim(),
    password: hashPassword(userData.password),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Save to storage
  const users = getAllUsers();
  users.push(newUser);
  setStorageItem('users_database', users);

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return {
    success: true,
    message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
    user: userWithoutPassword
  };
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Password
 * @returns {Object} - Login result { success, message, user?, token?, error? }
 */
export const loginUser = (credentials) => {
  // Validate inputs
  const emailValidation = validateEmail(credentials.email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS
    };
  }

  if (!credentials.password) {
    return {
      success: false,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS
    };
  }

  // Find user by email
  const user = findUserByEmail(credentials.email.trim());
  if (!user) {
    return {
      success: false,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS
    };
  }

  // Compare passwords
  if (!comparePassword(credentials.password, user.password)) {
    return {
      success: false,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS
    };
  }

  // Create session token
  const token = `token_${generateId()}`;

  // Store session
  const { password, ...userWithoutPassword } = user;
  setStorageItem(STORAGE_KEYS.AUTH_USER, userWithoutPassword);
  setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);

  return {
    success: true,
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    user: userWithoutPassword,
    token
  };
};

/**
 * Logout user
 * @returns {Object} - Logout result
 */
export const logoutUser = () => {
  removeStorageItem(STORAGE_KEYS.AUTH_USER);
  removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);

  return {
    success: true,
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
  };
};

/**
 * Get current authenticated user
 * @returns {Object|null} - User object or null
 */
export const getCurrentUser = () => {
  return getStorageItem(STORAGE_KEYS.AUTH_USER) || null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} - Is authenticated
 */
export const isAuthenticated = () => {
  return !!getStorageItem(STORAGE_KEYS.AUTH_TOKEN) && !!getStorageItem(STORAGE_KEYS.AUTH_USER);
};

/**
 * Get authentication token
 * @returns {string|null} - Token or null
 */
export const getAuthToken = () => {
  return getStorageItem(STORAGE_KEYS.AUTH_TOKEN) || null;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Object} - Update result
 */
export const updateUserProfile = (userId, updates) => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return {
      success: false,
      error: ERROR_MESSAGES.NOT_FOUND
    };
  }

  // Validate new email if changing
  if (updates.email && updates.email !== users[userIndex].email) {
    const emailValidation = validateEmail(updates.email);
    if (!emailValidation.isValid) {
      return {
        success: false,
        error: emailValidation.error
      };
    }

    // Check if email already in use
    if (findUserByEmail(updates.email)) {
      return {
        success: false,
        error: ERROR_MESSAGES.DUPLICATE_USER
      };
    }
  }

  // Update user
  const updatedUser = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date()
  };

  users[userIndex] = updatedUser;
  setStorageItem('users_database', users);

  // Update session if it's current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const { password, ...userWithoutPassword } = updatedUser;
    setStorageItem(STORAGE_KEYS.AUTH_USER, userWithoutPassword);
  }

  const { password, ...userWithoutPassword } = updatedUser;
  return {
    success: true,
    message: 'Profile updated successfully',
    user: userWithoutPassword
  };
};

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Object} - Change result
 */
export const changePassword = (userId, currentPassword, newPassword) => {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return {
      success: false,
      error: ERROR_MESSAGES.NOT_FOUND
    };
  }

  if (!comparePassword(currentPassword, user.password)) {
    return {
      success: false,
      error: 'Current password is incorrect'
    };
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      error: passwordValidation.error
    };
  }

  user.password = hashPassword(newPassword);
  user.updatedAt = new Date();

  setStorageItem('users_database', users);

  return {
    success: true,
    message: 'Password changed successfully'
  };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} - User object without password or null
 */
export const getUserById = (userId) => {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return null;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const AuthService = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  getAuthToken,
  updateUserProfile,
  changePassword,
  getUserById
};
