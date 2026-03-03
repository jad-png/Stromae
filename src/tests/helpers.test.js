/**
 * Helpers Tests
 */

import { describe, it, expect } from 'vitest';
import {
  generateId,
  formatDate,
  extractYouTubeVideoId,
  convertToYouTubeEmbedUrl,
  isEmpty,
  objectsEqual,
  sortBy,
  filterBy,
  searchItems,
  paginate
} from '../utils/helpers';

describe('Helpers', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
    });
  });

  describe('extractYouTubeVideoId', () => {
    it('should extract ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      const id = extractYouTubeVideoId(url);
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from standard URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const id = extractYouTubeVideoId(url);
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('should handle invalid URL', () => {
      const url = 'https://example.com/video';
      const id = extractYouTubeVideoId(url);
      expect(id).toBeNull();
    });
  });

  describe('convertToYouTubeEmbedUrl', () => {
    it('should convert video ID to embed URL', () => {
      const id = 'dQw4w9WgXcQ';
      const url = convertToYouTubeEmbedUrl(id);
      expect(url).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('objectsEqual', () => {
    it('should compare objects correctly', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2 };
      expect(objectsEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for different objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      expect(objectsEqual(obj1, obj2)).toBe(false);
    });
  });

  describe('sortBy', () => {
    it('should sort array by property', () => {
      const arr = [{ name: 'Charlie', age: 30 }, { name: 'Alice', age: 25 }, { name: 'Bob', age: 35 }];
      const sorted = sortBy(arr, 'age', 'asc');
      expect(sorted[0].age).toBe(25);
      expect(sorted[sorted.length - 1].age).toBe(35);
    });

    it('should sort in descending order', () => {
      const arr = [{ value: 10 }, { value: 20 }, { value: 5 }];
      const sorted = sortBy(arr, 'value', 'desc');
      expect(sorted[0].value).toBe(20);
      expect(sorted[sorted.length - 1].value).toBe(5);
    });
  });

  describe('filterBy', () => {
    it('should filter array by criteria', () => {
      const arr = [
        { type: 'FILM', year: 2020 },
        { type: 'SERIE', year: 2020 },
        { type: 'FILM', year: 2021 }
      ];
      const filtered = filterBy(arr, { type: 'FILM', year: 2020 });
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('FILM');
    });
  });

  describe('searchItems', () => {
    it('should search items in specified fields', () => {
      const arr = [
        { title: 'The Matrix', director: 'Lane Wachowski' },
        { title: 'Inception', director: 'Christopher Nolan' }
      ];
      const results = searchItems(arr, 'matrix', ['title']);
      expect(results.length).toBe(1);
    });
  });

  describe('paginate', () => {
    it('should paginate array correctly', () => {
      const arr = Array.from({ length: 25 }, (_, i) => ({ id: i }));
      const result = paginate(arr, 1, 10);
      expect(result.items.length).toBe(10);
      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(true);
    });

    it('should handle last page', () => {
      const arr = Array.from({ length: 25 }, (_, i) => ({ id: i }));
      const result = paginate(arr, 3, 10);
      expect(result.items.length).toBe(5);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
    });
  });
});
