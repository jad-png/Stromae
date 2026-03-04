/**
 * Video Service - Manages video data and operations
 */

import { generateId, sortBy, filterBy, searchItems } from '../utils/helpers.js';
import { setStorageItem, getStorageItem } from '../utils/storage.js';
import { STORAGE_KEYS, CACHE_DURATION } from '../types/index.js';
import { mockVideos } from '../mocks/videos.js';
import { VIDEO_CATEGORIES } from '../mocks/categories.js';

/**
 * Initialize mock data if not exists
 */
const initializeMockData = () => {
  if (!getStorageItem(STORAGE_KEYS.VIDEOS)) {
    setStorageItem(STORAGE_KEYS.VIDEOS, mockVideos, {
      expiresIn: CACHE_DURATION.VIDEOS
    });
  }
};

/**
 * Get all videos
 * @returns {Array} - Array of videos
 */
export const getAllVideos = () => {
  initializeMockData();
  return getStorageItem(STORAGE_KEYS.VIDEOS) || mockVideos;
};

/**
 * Get video by ID
 * @param {string} videoId - Video ID to retrieve
 * @returns {Object|null} - Video object or null
 */
export const getVideoById = (videoId) => {
  const videos = getAllVideos();
  return videos.find(video => video.id === videoId) || null;
};

/**
 * Search videos by title and description
 * @param {string} query - Search query
 * @returns {Array} - Matching videos
 */
export const searchVideos = (query) => {
  const videos = getAllVideos();
  return searchItems(videos, query, ['title', 'description', 'director']);
};

/**
 * Filter videos by type and category
 * @param {Object} filters - Filter options
 * @param {string} filters.type - Video type filter
 * @param {string} filters.categoryId - Category filter
 * @param {number} filters.minRating - Minimum rating filter
 * @returns {Array} - Filtered videos
 */
export const filterVideos = (filters = {}) => {
  let videos = getAllVideos();

  if (filters.type) {
    videos = videos.filter(v => v.type === filters.type);
  }

  if (filters.categoryId) {
    videos = videos.filter(v => v.categoryId === filters.categoryId);
  }

  if (filters.minRating !== undefined) {
    videos = videos.filter(v => v.rating >= filters.minRating);
  }

  return videos;
};

/**
 * Sort videos by specified criteria
 * @param {Array} videos - Videos to sort
 * @param {string} sortOption - Sort criteria ('recent', 'rating', 'popularity')
 * @returns {Array} - Sorted videos
 */
export const getSortedVideos = (videos, sortOption = 'recent') => {
  const videoList = Array.isArray(videos) ? videos : getAllVideos();

  switch (sortOption) {
    case 'recent':
      return sortBy(videoList, 'createdAt', 'desc');
    case 'rating':
      return sortBy(videoList, 'rating', 'desc');
    case 'popularity':
      return sortBy(videoList, 'viewCount', 'desc');
    default:
      return videoList;
  }
};

/**
 * Get similar videos based on category and type
 * @param {string} videoId - Reference video ID
 * @param {number} limit - Number of similar videos to return
 * @returns {Array} - Similar videos
 */
export const getSimilarVideos = (videoId, limit = 5) => {
  const video = getVideoById(videoId);
  if (!video) return [];

  const videos = getAllVideos();
  const similar = videos.filter(v =>
    v.id !== videoId &&
    (v.categoryId === video.categoryId || v.type === video.type)
  );

  return similar.slice(0, limit);
};

/**
 * Add new video (admin only in production)
 * @param {Object} videoData - Video data
 * @returns {Object} - Created video with ID
 */
export const addVideo = (videoData) => {
  if (!videoData.title || !videoData.trailerUrl) {
    throw new Error('Title and trailer URL are required');
  }

  const newVideo = {
    ...videoData,
    id: generateId(),
    viewCount: 0,
    createdAt: new Date()
  };

  const videos = getAllVideos();
  videos.push(newVideo);
  setStorageItem(STORAGE_KEYS.VIDEOS, videos);

  return newVideo;
};

/**
 * Update video (admin only in production)
 * @param {string} videoId - Video ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} - Updated video
 */
export const updateVideo = (videoId, updates) => {
  const videos = getAllVideos();
  const index = videos.findIndex(v => v.id === videoId);

  if (index === -1) return null;

  videos[index] = { ...videos[index], ...updates };
  setStorageItem(STORAGE_KEYS.VIDEOS, videos);

  return videos[index];
};

/**
 * Delete video (admin only in production)
 * @param {string} videoId - Video ID to delete
 * @returns {boolean} - Success indicator
 */
export const deleteVideo = (videoId) => {
  const videos = getAllVideos();
  const filteredVideos = videos.filter(v => v.id !== videoId);

  if (filteredVideos.length === videos.length) return false;

  setStorageItem(STORAGE_KEYS.VIDEOS, filteredVideos);
  return true;
};

/**
 * Increment video view count
 * @param {string} videoId - Video ID
 */
export const incrementViewCount = (videoId) => {
  const video = getVideoById(videoId);
  if (video) {
    updateVideo(videoId, { viewCount: video.viewCount + 1 });
  }
};

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|null} - Category object
 */
export const getCategoryById = (categoryId) => {
  return VIDEO_CATEGORIES.find(c => c.id === categoryId) || null;
};

/**
 * Get all categories
 * @returns {Array} - All categories
 */
export const getAllCategories = () => {
  return VIDEO_CATEGORIES;
};

export const VideoService = {
  getAllVideos,
  getVideoById,
  searchVideos,
  filterVideos,
  getSortedVideos,
  getSimilarVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  incrementViewCount,
  getCategoryById,
  getAllCategories
};
