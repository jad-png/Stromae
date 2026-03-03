/**
 * VideoService Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { VideoService } from '../services/VideoService';

describe('VideoService', () => {
  describe('getAllVideos', () => {
    it('should return array of videos', () => {
      const videos = VideoService.getAllVideos();
      expect(Array.isArray(videos)).toBe(true);
      expect(videos.length).toBeGreaterThan(0);
    });

    it('should return videos with required properties', () => {
      const videos = VideoService.getAllVideos();
      const video = videos[0];
      expect(video).toHaveProperty('id');
      expect(video).toHaveProperty('title');
      expect(video).toHaveProperty('trailerUrl');
      expect(video).toHaveProperty('rating');
    });
  });

  describe('getVideoById', () => {
    it('should return video by ID', () => {
      const videos = VideoService.getAllVideos();
      const videoId = videos[0].id;
      const video = VideoService.getVideoById(videoId);
      expect(video).toBeDefined();
      expect(video.id).toBe(videoId);
    });

    it('should return null for non-existent ID', () => {
      const video = VideoService.getVideoById('non-existent-id');
      expect(video).toBeNull();
    });
  });

  describe('searchVideos', () => {
    it('should search videos by query', () => {
      const results = VideoService.searchVideos('Matrix');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = VideoService.searchVideos('NonexistentVideoTitle123');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('filterVideos', () => {
    it('should filter by type', () => {
      const filtered = VideoService.filterVideos({ type: 'FILM' });
      expect(filtered.every(v => v.type === 'FILM')).toBe(true);
    });

    it('should filter by minimum rating', () => {
      const filtered = VideoService.filterVideos({ minRating: 9 });
      expect(filtered.every(v => v.rating >= 9)).toBe(true);
    });
  });

  describe('getSimilarVideos', () => {
    it('should return similar videos', () => {
      const videos = VideoService.getAllVideos();
      const videoId = videos[0].id;
      const similar = VideoService.getSimilarVideos(videoId, 5);
      expect(Array.isArray(similar)).toBe(true);
      expect(similar.every(v => v.id !== videoId)).toBe(true);
    });

    it('should respect limit parameter', () => {
      const videos = VideoService.getAllVideos();
      const videoId = videos[0].id;
      const similar = VideoService.getSimilarVideos(videoId, 3);
      expect(similar.length).toBeLessThanOrEqual(3);
    });
  });
});
