/**
 * Video Service - Manages video data and operations
 */

import { generateId, sortBy, filterBy, searchItems } from '../utils/helpers.js';
import { setStorageItem, getStorageItem } from '../utils/storage.js';
import { STORAGE_KEYS, CACHE_DURATION, VIDEO_TYPES, VIDEO_CATEGORIES } from '../types/index.js';

/**
 * Mock video database - In production, this would be an API call
 */
const mockVideos = [
  {
    id: '1',
    title: 'The Matrix',
    description: 'A computer programmer discovers that reality as he knows it is a simulation.',
    thumbnailUrl: 'https://via.placeholder.com/300x400?text=The+Matrix',
    trailerUrl: 'https://www.youtube.com/embed/vKQi3bBA1y8',
    duration: 136,
    releaseYear: 1999,
    type: VIDEO_TYPES.FILM,
    categoryId: '4',
    rating: 8.7,
    director: 'Lana Wachowski, Lilly Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    viewCount: 1000000,
    createdAt: new Date('1999-03-31')
  },
  {
    id: '2',
    title: 'Inception',
    description: 'A skilled thief steals corporate secrets through the use of dream-sharing technology.',
    thumbnailUrl: 'https://via.placeholder.com/300x400?text=Inception',
    trailerUrl: 'https://www.youtube.com/embed/8zQcxVOm9Ko',
    duration: 148,
    releaseYear: 2010,
    type: VIDEO_TYPES.FILM,
    categoryId: '4',
    rating: 8.8,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Ellen Page'],
    viewCount: 800000,
    createdAt: new Date('2010-07-16')
  },
  {
    id: '3',
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.',
    thumbnailUrl: 'https://via.placeholder.com/300x400?text=Pulp+Fiction',
    trailerUrl: 'https://www.youtube.com/embed/s7EdQ4FsOc0',
    duration: 154,
    releaseYear: 1994,
    type: VIDEO_TYPES.FILM,
    categoryId: '3',
    rating: 8.9,
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman'],
    viewCount: 900000,
    createdAt: new Date('1994-10-14')
  },
  {
    id: '4',
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher turned methamphetamine producer.',
    thumbnailUrl: 'https://via.placeholder.com/300x400?text=Breaking+Bad',
    trailerUrl: 'https://www.youtube.com/embed/HhesaQXLuRY',
    duration: 47,
    releaseYear: 2008,
    type: VIDEO_TYPES.SERIE,
    categoryId: '2',
    rating: 9.5,
    director: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    viewCount: 2000000,
    createdAt: new Date('2008-01-20')
  },
  {
    id: '5',
    title: 'The Office',
    description: 'A mockumentary on a group of office employees in their daily lives.',
    thumbnailUrl: 'https://via.placeholder.com/300x400?text=The+Office',
    trailerUrl: 'https://www.youtube.com/embed/ulghjH2dKvE',
    duration: 22,
    releaseYear: 2005,
    type: VIDEO_TYPES.SERIE,
    categoryId: '2',
    rating: 9.0,
    director: 'Greg Daniels, Michael Schur',
    cast: ['Steve Carell', 'Rainn Wilson', 'Jenna Fischer'],
    viewCount: 1500000,
    createdAt: new Date('2005-03-24')
  },
  {
    id: '6',
    title: 'Our Planet',
    description: 'David Attenborough narrates a documentary series about life on Earth.',
    thumbnailUrl: 'https://via.placeholder.com/300x400?text=Our+Planet',
    trailerUrl: 'https://www.youtube.com/embed/nohHMJ5t8LU',
    duration: 50,
    releaseYear: 2019,
    type: VIDEO_TYPES.DOCUMENTAIRE,
    categoryId: '6',
    rating: 9.2,
    director: 'Alastair Fothergill, Jon East',
    cast: ['David Attenborough'],
    viewCount: 1200000,
    createdAt: new Date('2019-04-05')
  }
];

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
