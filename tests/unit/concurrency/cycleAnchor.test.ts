import { describe, it, expect } from 'vitest';
import { 
  calculateCycleKey, 
  buildDeduplicationId, 
  getCycleBounds 
} from '@/app/lib/algorithms/cycleAnchor';

describe('cycleAnchor Algorithm & Deduplication Invariants', () => {
  describe('calculateCycleKey() Temporal Boundaries', () => {
    it('anchors any time on Sunday to that exact Sunday (00:00:00 UTC vs 23:59:59 UTC)', () => {
      // 2026-11-01 is a Sunday
      const sundayMorning = new Date(Date.UTC(2026, 10, 1, 0, 0, 0, 0));
      const sundayNight = new Date(Date.UTC(2026, 10, 1, 23, 59, 59, 999));

      expect(calculateCycleKey(sundayMorning)).toBe('20261101');
      expect(calculateCycleKey(sundayNight)).toBe('20261101');
      expect(calculateCycleKey(sundayMorning)).toBe(calculateCycleKey(sundayNight));
    });

    it('anchors Monday through Saturday back to the preceding Sunday', () => {
      // Sunday: Nov 1, Monday: Nov 2, Friday: Nov 6, Saturday: Nov 7
      const monday = new Date(Date.UTC(2026, 10, 2, 10, 0, 0));
      const wednesday = new Date(Date.UTC(2026, 10, 4, 15, 30, 0));
      const saturday = new Date(Date.UTC(2026, 10, 7, 23, 59, 59));

      expect(calculateCycleKey(monday)).toBe('20261101');
      expect(calculateCycleKey(wednesday)).toBe('20261101');
      expect(calculateCycleKey(saturday)).toBe('20261101');
    });

    it('handles Year-End and Month Rollovers (Dec 31 to Jan 1)', () => {
      // 2026-12-31 is a Thursday -> preceding Sunday is Dec 27, 2026
      const newYearsEve = new Date(Date.UTC(2026, 11, 31, 23, 59, 0));
      expect(calculateCycleKey(newYearsEve)).toBe('20261227');

      // 2027-01-01 is a Friday -> preceding Sunday is still Dec 27, 2026
      const newYearsDay = new Date(Date.UTC(2027, 0, 1, 1, 0, 0));
      expect(calculateCycleKey(newYearsDay)).toBe('20261227');

      // 2027-01-03 is the first Sunday of 2027
      const firstSunday2027 = new Date(Date.UTC(2027, 0, 3, 12, 0, 0));
      expect(calculateCycleKey(firstSunday2027)).toBe('20270103');
    });

    it('handles Leap Year boundary correctly (Feb 29)', () => {
      // 2024 was a leap year. Feb 29, 2024 was a Thursday. Preceding Sunday: Feb 25, 2024.
      const leapDay = new Date(Date.UTC(2024, 1, 29, 12, 0, 0));
      expect(calculateCycleKey(leapDay)).toBe('20240225');
    });
  });

  describe('buildDeduplicationId() Format & Invariants', () => {
    it('constructs deterministic review deduplication key format', () => {
      const dedupId = buildDeduplicationId('usr_12345', '20261101');
      expect(dedupId).toBe('review-20261101-usr_12345');
    });

    it('trims whitespace and rejects empty strings or missing IDs', () => {
      expect(() => buildDeduplicationId('', '20261101')).toThrow('Both userId and cycleKey are required');
      expect(() => buildDeduplicationId('usr_1', '  ')).toThrow('Both userId and cycleKey are required');
      
      const trimmed = buildDeduplicationId('  usr_999  ', ' 20261101 ');
      expect(trimmed).toBe('review-20261101-usr_999');
    });

    it('guarantees identical output for same inputs across different calls', () => {
      const id1 = buildDeduplicationId('usr_abc', '20261101');
      const id2 = buildDeduplicationId('usr_abc', '20261101');
      expect(id1).toBe(id2);
    });
  });

  describe('getCycleBounds() Date Calculations', () => {
    it('computes exact start and end of week (Sunday 00:00:00 to Saturday 23:59:59.999)', () => {
      const bounds = getCycleBounds('20261101');

      expect(bounds.startOfWeek.toISOString()).toBe('2026-11-01T00:00:00.000Z');
      expect(bounds.endOfWeek.toISOString()).toBe('2026-11-07T23:59:59.999Z');
    });

    it('throws error on invalid cycleKey formats', () => {
      expect(() => getCycleBounds('2026-11-01')).toThrow('Invalid cycleKey format');
      expect(() => getCycleBounds('invalid')).toThrow('Invalid cycleKey format');
    });
  });
});

