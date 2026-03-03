/**
 * Helper utilities and common functions
 */

/**
 * Generate unique ID using timestamp and random number
 * @returns {string} - Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted date
 */
export const formatDate = (date, locale = 'en-US') => {
  try {
    const d = new Date(date);
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

/**
 * Format duration to HH:MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || seconds < 0) return '00:00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [hours, minutes, secs]
    .map(val => String(val).padStart(2, '0'))
    .join(':');
};

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
export const extractYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;

  // Handle embed URL
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{10,})/);
  if (embedMatch) return embedMatch[1];

  // Handle standard URL
  const standardMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{10,})/);
  if (standardMatch) return standardMatch[1];

  // Handle shorthand
  if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
};

/**
 * Convert YouTube video ID to embed URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Embed URL
 */
export const convertToYouTubeEmbedUrl = (videoId) => {
  if (!videoId || typeof videoId !== 'string') return '';
  return `https://www.youtube.com/embed/${videoId.trim()}`;
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Deep clone error:', error);
    return obj;
  }
};

/**
 * Check if value is empty
 * @param {any} value - Value to check
 * @returns {boolean} - Is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Compare two objects for equality
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {boolean} - Are equal
 */
export const objectsEqual = (obj1, obj2) => {
  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  } catch (error) {
    console.error('Object comparison error:', error);
    return false;
  }
};

/**
 * Sort array of objects by property
 * @param {Array} arr - Array to sort
 * @param {string} property - Property to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted array
 */
export const sortBy = (arr, property, order = 'asc') => {
  if (!Array.isArray(arr)) return arr;

  return [...arr].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by multiple criteria
 * @param {Array} arr - Array to filter
 * @param {Object} criteria - Filter criteria object
 * @returns {Array} - Filtered array
 */
export const filterBy = (arr, criteria) => {
  if (!Array.isArray(arr)) return arr;

  return arr.filter(item =>
    Object.keys(criteria).every(key => {
      if (Array.isArray(criteria[key])) {
        return criteria[key].includes(item[key]);
      }
      return item[key] === criteria[key];
    })
  );
};

/**
 * Search array items by string in multiple fields
 * @param {Array} arr - Array to search
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in
 * @returns {Array} - Filtered results
 */
export const searchItems = (arr, query, fields = []) => {
  if (!query || !Array.isArray(arr)) return arr;

  const lowerQuery = query.toLowerCase().trim();

  return arr.filter(item =>
    fields.some(field =>
      String(item[field] || '')
        .toLowerCase()
        .includes(lowerQuery)
    )
  );
};

/**
 * Paginate array
 * @param {Array} arr - Array to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Object} - Pagination result
 */
export const paginate = (arr, page = 1, pageSize = 10) => {
  if (!Array.isArray(arr) || page < 1 || pageSize < 1) {
    return { items: [], page, pageSize, total: 0, totalPages: 0 };
  }

  const total = arr.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = arr.slice(startIndex, startIndex + pageSize);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

/**
 * Retry async function with exponential backoff
 * @param {Function} func - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} - Function result
 */
export const retryAsync = async (func, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await func();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};
