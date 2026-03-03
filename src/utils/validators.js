import { VALIDATION_RULES, ERROR_MESSAGES } from '../types/index.js';

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.FIELD_REQUIRED };
  }

  if (!VALIDATION_RULES.email.pattern.test(email.trim())) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  return { isValid: true };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validatePassword = (password) => {
  const { minLength, maxLength, requireUppercase, requireNumber, requireSpecialChar } = VALIDATION_RULES.password;

  if (!password || typeof password !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.FIELD_REQUIRED };
  }

  if (password.length < minLength || password.length > maxLength) {
    return { isValid: false, error: `Password must be between ${minLength} and ${maxLength} characters` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain an uppercase letter' };
  }

  if (requireNumber && !/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain a number' };
  }

  if (requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: 'Password must contain a special character' };
  }

  return { isValid: true };
};

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateUsername = (username) => {
  const { minLength, maxLength, pattern } = VALIDATION_RULES.username;

  if (!username || typeof username !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.FIELD_REQUIRED };
  }

  if (username.length < minLength || username.length > maxLength) {
    return { isValid: false, error: `Username must be between ${minLength} and ${maxLength} characters` };
  }

  if (!pattern.test(username)) {
    return { isValid: false, error: 'Username can only contain alphanumeric characters, hyphens, and underscores' };
  }

  return { isValid: true };
};

/**
 * Validates video title
 * @param {string} title - Title to validate
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateVideoTitle = (title) => {
  const { minLength, maxLength } = VALIDATION_RULES.videoTitle;

  if (!title || typeof title !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.FIELD_REQUIRED };
  }

  if (title.trim().length < minLength || title.length > maxLength) {
    return { isValid: false, error: `Title must be between ${minLength} and ${maxLength} characters` };
  }

  return { isValid: true };
};

/**
 * Validates rating value
 * @param {number} rating - Rating to validate
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateRating = (rating) => {
  const { min, max } = VALIDATION_RULES.rating;

  if (rating === undefined || rating === null) {
    return { isValid: false, error: ERROR_MESSAGES.FIELD_REQUIRED };
  }

  if (typeof rating !== 'number' || rating < min || rating > max) {
    return { isValid: false, error: `Rating must be between ${min} and ${max}` };
  }

  return { isValid: true };
};

/**
 * Validates YouTube embed URL
 * @param {string} url - URL to validate
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.FIELD_REQUIRED };
  }

  // Pattern for YouTube iframe embed URLs
  const youtubePattern = /^https:\/\/www\.youtube\.com\/embed\/[\w-]{10,}(\?.*)?$/;

  if (!youtubePattern.test(url.trim())) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_VIDEO_URL };
  }

  return { isValid: true };
};

/**
 * Validates registration form data
 * @param {Object} formData - Form data object
 * @param {string} formData.username - Username
 * @param {string} formData.email - Email
 * @param {string} formData.password - Password
 * @param {string} formData.confirmPassword - Password confirmation
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  // Validate username
  const usernameValidation = validateUsername(formData.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
  }

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  // Validate password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates login form data
 * @param {Object} formData - Form data object
 * @param {string} formData.email - Email
 * @param {string} formData.password - Password
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  if (!formData.password) {
    errors.password = ERROR_MESSAGES.FIELD_REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize and normalize form input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate all form fields at once
 * @param {Object} formData - Form data to validate
 * @param {string} formType - Type of form ('login' or 'register')
 * @returns {Object} - Validation result
 */
export const validateForm = (formData, formType) => {
  if (formType === 'login') {
    return validateLoginForm(formData);
  } else if (formType === 'register') {
    return validateRegistrationForm(formData);
  }
  return { isValid: false, errors: {} };
};
