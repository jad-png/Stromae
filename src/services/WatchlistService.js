/**
 * Watchlist Service
 * Manages user watchlist entries with duplicate detection
 */

import { generateId } from '../utils/helpers.js';
import { setStorageItem, getStorageItem } from '../utils/storage.js';
import { STORAGE_KEYS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../types/index.js';

/**
 * Get user's watchlist
 * @param {string} userId - User ID
 * @returns {Array} - Watchlist items
 */
export const getWatchlist = (userId) => {
  if (!userId) return [];

  const watchlist = getStorageItem(`${STORAGE_KEYS.WATCHLIST}_${userId}`) || [];
  return Array.isArray(watchlist) ? watchlist : [];
};

/**
 * Check if video is in watchlist (duplicate detection)
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {boolean} - Video exists in watchlist
 */
const isDuplicateWatchlistEntry = (userId, videoId) => {
  const watchlist = getWatchlist(userId);
  return watchlist.some(item => item.videoId === videoId);
};

/**
 * Add video to watchlist
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {Object} - Operation result
 */
export const addToWatchlist = (userId, videoId) => {
  if (!userId || !videoId) {
    return {
      success: false,
      error: ERROR_MESSAGES.FIELD_REQUIRED
    };
  }

  // Check for duplicates
  if (isDuplicateWatchlistEntry(userId, videoId)) {
    return {
      success: false,
      error: ERROR_MESSAGES.DUPLICATE_WATCHLIST
    };
  }

  const watchlistItem = {
    id: generateId(),
    userId,
    videoId,
    addedAt: new Date()
  };

  const watchlist = getWatchlist(userId);
  watchlist.push(watchlistItem);

  setStorageItem(`${STORAGE_KEYS.WATCHLIST}_${userId}`, watchlist);

  return {
    success: true,
    message: SUCCESS_MESSAGES.ADDED_TO_WATCHLIST,
    item: watchlistItem
  };
};

/**
 * Remove video from watchlist
 * @param {string} userId - User ID
 * @param {string} watchlistId - Watchlist entry ID
 * @returns {Object} - Operation result
 */
export const removeFromWatchlist = (userId, watchlistId) => {
  if (!userId || !watchlistId) {
    return {
      success: false,
      error: ERROR_MESSAGES.FIELD_REQUIRED
    };
  }

  const watchlist = getWatchlist(userId);
  const filteredWatchlist = watchlist.filter(item => item.id !== watchlistId);

  if (filteredWatchlist.length === watchlist.length) {
    return {
      success: false,
      error: ERROR_MESSAGES.NOT_FOUND
    };
  }

  setStorageItem(`${STORAGE_KEYS.WATCHLIST}_${userId}`, filteredWatchlist);

  return {
    success: true,
    message: SUCCESS_MESSAGES.REMOVED_FROM_WATCHLIST
  };
};

/**
 * Remove video from watchlist by video ID
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {Object} - Operation result
 */
export const removeFromWatchlistByVideoId = (userId, videoId) => {
  if (!userId || !videoId) {
    return {
      success: false,
      error: ERROR_MESSAGES.FIELD_REQUIRED
    };
  }

  const watchlist = getWatchlist(userId);
  const entry = watchlist.find(item => item.videoId === videoId);

  if (!entry) {
    return {
      success: false,
      error: ERROR_MESSAGES.NOT_FOUND
    };
  }

  return removeFromWatchlist(userId, entry.id);
};

/**
 * Check if video is in user's watchlist
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {boolean} - Video in watchlist
 */
export const isInWatchlist = (userId, videoId) => {
  if (!userId || !videoId) return false;
  return isDuplicateWatchlistEntry(userId, videoId);
};

/**
 * Get watchlist count
 * @param {string} userId - User ID
 * @returns {number} - Number of items in watchlist
 */
export const getWatchlistCount = (userId) => {
  return getWatchlist(userId).length;
};

/**
 * Clear entire watchlist
 * @param {string} userId - User ID
 * @returns {Object} - Operation result
 */
export const clearWatchlist = (userId) => {
  if (!userId) {
    return {
      success: false,
      error: ERROR_MESSAGES.FIELD_REQUIRED
    };
  }

  setStorageItem(`${STORAGE_KEYS.WATCHLIST}_${userId}`, []);

  return {
    success: true,
    message: 'Watchlist cleared'
  };
};

export const WatchlistService = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  removeFromWatchlistByVideoId,
  isInWatchlist,
  getWatchlistCount,
  clearWatchlist
};

/**
 * Watch History Service
 * Manages user watch history with tracking of progress and completion
 */

/**
 * Get user's watch history
 * @param {string} userId - User ID
 * @returns {Array} - Watch history items
 */
export const getWatchHistory = (userId) => {
  if (!userId) return [];

  const history = getStorageItem(`${STORAGE_KEYS.WATCH_HISTORY}_${userId}`) || [];
  return Array.isArray(history) ? history : [];
};

/**
 * Check if video is in history (duplicate detection)
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {Object|null} - Existing history entry or null
 */
const getHistoryEntry = (userId, videoId) => {
  const history = getWatchHistory(userId);
  return history.find(item => item.videoId === videoId) || null;
};

/**
 * Add or update watch history entry
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @param {Object} options - History options
 * @param {number} options.progressTime - Current progress in seconds
 * @param {boolean} options.completed - Whether video was completed
 * @returns {Object} - Operation result
 */
export const recordWatchHistory = (userId, videoId, options = {}) => {
  if (!userId || !videoId) {
    return {
      success: false,
      error: ERROR_MESSAGES.FIELD_REQUIRED
    };
  }

  let history = getWatchHistory(userId);
  const existingEntry = getHistoryEntry(userId, videoId);

  if (existingEntry) {
    // Update existing entry
    existingEntry.progressTime = options.progressTime || existingEntry.progressTime;
    existingEntry.completed = options.completed || existingEntry.completed;
    existingEntry.watchedAt = new Date();
  } else {
    // Create new entry
    const newEntry = {
      id: generateId(),
      userId,
      videoId,
      watchedAt: new Date(),
      progressTime: options.progressTime || 0,
      completed: options.completed || false
    };
    history.push(newEntry);
  }

  setStorageItem(`${STORAGE_KEYS.WATCH_HISTORY}_${userId}`, history);

  return {
    success: true,
    message: 'Watch history updated'
  };
};

/**
 * Mark video as completed
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {Object} - Operation result
 */
export const markAsCompleted = (userId, videoId) => {
  return recordWatchHistory(userId, videoId, { completed: true });
};

/**
 * Remove entry from watch history
 * @param {string} userId - User ID
 * @param {string} historyId - History entry ID
 * @returns {Object} - Operation result
 */
export const removeFromWatchHistory = (userId, historyId) => {
  if (!userId || !historyId) {
    return {
      success: false,
      error: ERROR_MESSAGES.FIELD_REQUIRED
    };
  }

  const history = getWatchHistory(userId);
  const filteredHistory = history.filter(item => item.id !== historyId);

  if (filteredHistory.length === history.length) {
    return {
      success: false,
      error: ERROR_MESSAGES.NOT_FOUND
    };
  }

  setStorageItem(`${STORAGE_KEYS.WATCH_HISTORY}_${userId}`, filteredHistory);

  return {
    success: true,
    message: 'Removed from history'
  };
};

/**
 * Get watch time statistics
 * @param {string} userId - User ID
 * @returns {Object} - Statistics object
 */
export const getWatchStatistics = (userId) => {
  const history = getWatchHistory(userId);

  const stats = {
    totalWatched: history.length,
    totalCompleted: history.filter(h => h.completed).length,
    totalProgressTime: history.reduce((sum, h) => sum + (h.progressTime || 0), 0),
    currentYear: new Date().getFullYear(),
    watchedThisYear: history.filter(h => new Date(h.watchedAt).getFullYear() === new Date().getFullYear()).length
  };

  return stats;
};

/**
 * Clear entire watch history
 * @param {string} userId - User ID
 * @returns {Object} - Operation result
 */
export const clearWatchHistory = (userId) => {
  if (!userId) {
    return {
      success: false,
      error: ERROR_MESSAGES.FIELD_REQUIRED
    };
  }

  setStorageItem(`${STORAGE_KEYS.WATCH_HISTORY}_${userId}`, []);

  return {
    success: true,
    message: 'Watch history cleared'
  };
};

export const WatchHistoryService = {
  getWatchHistory,
  recordWatchHistory,
  markAsCompleted,
  removeFromWatchHistory,
  getWatchStatistics,
  clearWatchHistory
};
