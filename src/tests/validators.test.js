/**
 * Validators Tests
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateRating,
  validateYouTubeUrl,
  validateLoginForm,
  validateRegistrationForm
} from '../utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate valid email addresses', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const result = validatePassword('SecurePass123!');
      expect(result.isValid).toBe(true);
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('securepass123!');
      expect(result.isValid).toBe(false);
    });

    it('should reject password without number', () => {
      const result = validatePassword('SecurePass!');
      expect(result.isValid).toBe(false);
    });

    it('should reject password without special character', () => {
      const result = validatePassword('SecurePass123');
      expect(result.isValid).toBe(false);
    });

    it('should reject password too short', () => {
      const result = validatePassword('Pass1!');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should accept valid username', () => {
      const result = validateUsername('user-name_123');
      expect(result.isValid).toBe(true);
    });

    it('should reject username too short', () => {
      const result = validateUsername('ab');
      expect(result.isValid).toBe(false);
    });

    it('should reject username with invalid characters', () => {
      const result = validateUsername('user@name');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateRating', () => {
    it('should accept valid rating', () => {
      const result = validateRating(7.5);
      expect(result.isValid).toBe(true);
    });

    it('should reject rating below 0', () => {
      const result = validateRating(-1);
      expect(result.isValid).toBe(false);
    });

    it('should reject rating above 10', () => {
      const result = validateRating(11);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateYouTubeUrl', () => {
    it('should accept valid YouTube embed URL', () => {
      const result = validateYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid URL', () => {
      const result = validateYouTubeUrl('https://example.com/video');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateLoginForm', () => {
    it('should validate complete login form', () => {
      const result = validateLoginForm({
        email: 'user@example.com',
        password: 'SecurePass123!'
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject form with missing password', () => {
      const result = validateLoginForm({
        email: 'user@example.com',
        password: ''
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBeDefined();
    });
  });

  describe('validateRegistrationForm', () => {
    it('should validate complete registration form', () => {
      const result = validateRegistrationForm({
        username: 'newuser',
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject form with mismatched passwords', () => {
      const result = validateRegistrationForm({
        username: 'newuser',
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.confirmPassword).toBeDefined();
    });
  });
});
