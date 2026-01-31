import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  calculateDaysBetween,
  truncateText,
  capitalizeWords,
  isEmpty,
  cn,
} from '@utils/helpers';

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      expect(cn('base', true && 'active')).toBe('base active');
      expect(cn('base', false && 'inactive')).toBe('base');
    });

    it('handles undefined and null values', () => {
      expect(cn('base', undefined, null, 'extra')).toBe('base extra');
    });
  });

  describe('formatCurrency', () => {
    it('formats PHP currency correctly', () => {
      const result = formatCurrency(1500, 'PHP', 'en-PH');
      expect(result).toContain('1,500');
    });

    it('uses default currency and locale', () => {
      const result = formatCurrency(1000);
      expect(result).toBeTruthy();
    });

    it('formats large numbers correctly', () => {
      const result = formatCurrency(1000000, 'PHP');
      expect(result).toContain('1,000,000');
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const result = formatDate('2026-01-31');
      expect(result).toContain('January');
      expect(result).toContain('31');
      expect(result).toContain('2026');
    });

    it('formats Date object correctly', () => {
      const date = new Date('2026-01-31');
      const result = formatDate(date);
      expect(result).toBeTruthy();
    });
  });

  describe('calculateDaysBetween', () => {
    it('calculates days between two dates correctly', () => {
      const result = calculateDaysBetween('2026-01-01', '2026-01-10');
      expect(result).toBe(9);
    });

    it('handles same day', () => {
      const result = calculateDaysBetween('2026-01-01', '2026-01-01');
      expect(result).toBe(0);
    });

    it('handles Date objects', () => {
      const start = new Date('2026-01-01');
      const end = new Date('2026-01-05');
      const result = calculateDaysBetween(start, end);
      expect(result).toBe(4);
    });
  });

  describe('truncateText', () => {
    it('truncates long text with ellipsis', () => {
      const result = truncateText('This is a very long text', 10);
      expect(result).toBe('This is a...');
    });

    it('does not truncate short text', () => {
      const result = truncateText('Short', 10);
      expect(result).toBe('Short');
    });

    it('handles exact length text', () => {
      const result = truncateText('Exactly10!', 10);
      expect(result).toBe('Exactly10!');
    });
  });

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    it('handles single word', () => {
      expect(capitalizeWords('hello')).toBe('Hello');
    });

    it('handles mixed case input', () => {
      expect(capitalizeWords('hElLo WoRLD')).toBe('Hello World');
    });
  });

  describe('isEmpty', () => {
    it('returns true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('returns true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('returns true for empty string', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('returns true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('returns true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('returns false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
    });
  });
});
