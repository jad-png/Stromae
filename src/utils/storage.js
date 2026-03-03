/**
 * Local Storage Service
 * Provides secure storage management with encryption
 */

import { STORAGE_KEYS, CACHE_DURATION } from '../types/index.js';

/**
 * Simple encryption function (Caesar cipher for example)
 * In production, use a proper encryption library
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text
 */
const encrypt = (text) => {
  // For production, use crypto libraries like crypto-js
  // This is a simple example
  try {
    return btoa(text); // Base64 encoding
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

/**
 * Simple decryption function
 * @param {string} encryptedText - Text to decrypt
 * @returns {string} - Decrypted text
 */
const decrypt = (encryptedText) => {
  try {
    return atob(encryptedText); // Base64 decoding
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText;
  }
};

/**
 * Store data in localStorage with optional encryption
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {Object} options - Storage options
 * @param {boolean} options.encrypted - Whether to encrypt
 * @param {number} options.expiresIn - Expiration time in milliseconds
 */
export const setStorageItem = (key, value, options = {}) => {
  try {
    const item = {
      value: value,
      timestamp: Date.now(),
      expiresIn: options.expiresIn || null
    };

    let data = JSON.stringify(item);

    if (options.encrypted) {
      data = encrypt(data);
    }

    localStorage.setItem(key, data);
    return true;
  } catch (error) {
    console.error('Storage error:', error);
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded');
    }
    return false;
  }
};

/**
 * Retrieve data from localStorage
 * @param {string} key - Storage key
 * @param {Object} options - Retrieval options
 * @param {boolean} options.encrypted - Whether data is encrypted
 * @returns {any} - Retrieved value or null
 */
export const getStorageItem = (key, options = {}) => {
  try {
    let data = localStorage.getItem(key);

    if (!data) {
      return null;
    }

    if (options.encrypted) {
      data = decrypt(data);
    }

    const item = JSON.parse(data);

    // Check if expired
    if (item.expiresIn) {
      const now = Date.now();
      if (now - item.timestamp > item.expiresIn) {
        localStorage.removeItem(key);
        return null;
      }
    }

    return item.value;
  } catch (error) {
    console.error('Storage retrieval error:', error);
    return null;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success indicator
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Storage removal error:', error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 * @returns {boolean} - Success indicator
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Storage clear error:', error);
    return false;
  }
};

/**
 * Check if storage item exists and is not expired
 * @param {string} key - Storage key
 * @returns {boolean} - Existence indicator
 */
export const hasStorageItem = (key) => {
  const item = getStorageItem(key);
  return item !== null;
};

/**
 * Get all storage items for a prefix
 * @param {string} prefix - Key prefix to search
 * @returns {Object} - Object with matching items
 */
export const getStorageItemsByPrefix = (prefix) => {
  const result = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      result[key] = getStorageItem(key);
    }
  }

  return result;
};

/**
 * Clear expired cache items
 * Removes localStorage items that have passed their expiration time
 */
export const clearExpiredCache = () => {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key) {
        getStorageItem(key); // This will remove expired items automatically
      }
    }
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
};
