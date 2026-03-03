/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} username - Username for login
 * @property {string} email - User email address
 * @property {string} password - Hashed password
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last account update timestamp
 */

/**
 * @typedef {Object} Video
 * @property {string} id - Unique video identifier
 * @property {string} title - Video title
 * @property {string} description - Video description
 * @property {string} thumbnailUrl - Thumbnail image URL
 * @property {string} trailerUrl - YouTube embed URL
 * @property {number} duration - Duration in minutes
 * @property {number} releaseYear - Year of release
 * @property {string} type - Type: 'FILM' | 'SERIE' | 'DOCUMENTAIRE'
 * @property {string} categoryId - Category identifier
 * @property {number} rating - Rating from 0 to 10
 * @property {string} director - Director name
 * @property {string[]} cast - Array of actor names
 * @property {number} viewCount - Number of views
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Category identifier
 * @property {string} name - Category name
 * @property {string} [description] - Optional description
 */

/**
 * @typedef {Object} Watchlist
 * @property {string} id - Watchlist entry identifier
 * @property {string} userId - User identifier
 * @property {string} videoId - Video identifier
 * @property {Date} addedAt - Timestamp when added
 */

/**
 * @typedef {Object} WatchHistory
 * @property {string} id - History entry identifier
 * @property {string} userId - User identifier
 * @property {string} videoId - Video identifier
 * @property {Date} watchedAt - Timestamp when watched
 * @property {number} progressTime - Current progress in seconds
 * @property {boolean} completed - Whether video was completed
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Current authenticated user
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Error message
 * @property {function} login - Login function
 * @property {function} register - Register function
 * @property {function} logout - Logout function
 * @property {function} clearError - Clear error function
 */

// Export type definitions (JS doesn't have native types, these are JSDoc definitions)
export const TYPES = {
  User: 'User',
  Video: 'Video',
  Category: 'Category',
  Watchlist: 'Watchlist',
  WatchHistory: 'WatchHistory'
};

export const VIDEO_TYPES = {
  FILM: 'FILM',
  SERIE: 'SERIE',
  DOCUMENTAIRE: 'DOCUMENTAIRE'
};

export const VIDEO_CATEGORIES = [
  { id: '1', name: 'Action' },
  { id: '2', name: 'Comédie' },
  { id: '3', name: 'Drame' },
  { id: '4', name: 'Science-Fiction' },
  { id: '5', name: 'Thriller' },
  { id: '6', name: 'Documentaire' },
  { id: '7', name: 'Horreur' }
];

export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    minLength: 8,
    maxLength: 50,
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: true
  },
  videoTitle: {
    minLength: 3,
    maxLength: 200
  },
  rating: {
    min: 0,
    max: 10
  }
};

export const ERROR_MESSAGES = {
  DUPLICATE_USER: 'Username or email already exists',
  INVALID_CREDENTIALS: 'Invalid username or password',
  INVALID_EMAIL: 'Invalid email format',
  WEAK_PASSWORD: 'Password must contain uppercase, number, and special character',
  FIELD_REQUIRED: 'This field is required',
  INVALID_VIDEO_URL: 'Invalid YouTube URL format',
  DUPLICATE_WATCHLIST: 'Video already in watchlist',
  DUPLICATE_HISTORY: 'Watch history entry already exists',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  REGISTER_SUCCESS: 'Account created successfully',
  LOGOUT_SUCCESS: 'Successfully logged out',
  ADDED_TO_WATCHLIST: 'Added to watchlist',
  REMOVED_FROM_WATCHLIST: 'Removed from watchlist',
  RATING_SAVED: 'Rating saved successfully'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout'
  },
  VIDEOS: {
    LIST: '/api/videos',
    GET: '/api/videos/:id',
    SEARCH: '/api/videos/search'
  },
  WATCHLIST: {
    LIST: '/api/watchlist',
    ADD: '/api/watchlist',
    REMOVE: '/api/watchlist/:id'
  },
  HISTORY: {
    LIST: '/api/history',
    ADD: '/api/history',
    UPDATE: '/api/history/:id'
  },
  USER: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/profile'
  }
};

export const STORAGE_KEYS = {
  AUTH_USER: 'auth_user',
  AUTH_TOKEN: 'auth_token',
  VIDEOS: 'videos_cache',
  WATCHLIST: 'watchlist',
  WATCH_HISTORY: 'watch_history',
  CATEGORIES: 'categories_cache',
  USER_RATINGS: 'user_ratings'
};

export const CACHE_DURATION = {
  VIDEOS: 3600000, // 1 hour
  CATEGORIES: 86400000, // 24 hours
  USER_PROFILE: 1800000 // 30 minutes
};
