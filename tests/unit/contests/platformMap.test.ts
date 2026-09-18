import { describe, it, expect } from 'vitest';
import { getPlatformConfig, PLATFORM_MAP, DEFAULT_PLATFORM_CONFIG } from '@/app/utils/platformMap';

describe('platformMap - getPlatformConfig', () => {
  describe('Representative platform mappings across categories', () => {
    it.each([
      ['leetcode', 'DSA & CP', 'Hot', '#eab308'],
      ['codeforces', 'DSA & CP', 'Hot', '#ef4444'],
      ['codechef', 'DSA & CP', 'Hot', '#f97316'],
      ['geeksforgeeks', 'DSA & CP', 'Hot', '#16a34a'],
      ['gfg', 'DSA & CP', 'Hot', '#16a34a'],
      ['hackerrank', 'DSA & CP', 'Hot', '#22c55e'],
      ['atcoder', 'DSA & CP', 'Recommended', '#14b8a6'],
      ['code360', 'DSA & CP', 'Recommended', '#14b8a6'],
      ['naukri', 'DSA & CP', 'Recommended', '#14b8a6'],
      ['topcoder', 'DSA & CP', 'Recommended', '#3b82f6'],
      ['spoj', 'DSA & CP', 'More', '#3b82f6'],
      ['luogu', 'DSA & CP', 'More', '#60a5fa'],
      ['kaggle', 'AI / ML', 'Hot', '#0ea5e9'],
      ['drivendata', 'AI / ML', 'Recommended', '#0ea5e9'],
      ['ctftime', 'Cybersecurity (CTF)', 'Recommended', '#8b5cf6'],
    ])('maps platform key "%s" to category "%s", priority "%s", and color "%s"', (key, expectedCategory, expectedPriority, expectedColor) => {
      const config = getPlatformConfig(key);
      expect(config.category).toBe(expectedCategory);
      expect(config.priority).toBe(expectedPriority);
      expect(config.color).toBe(expectedColor);
      expect(config.bg).toBeDefined();
      expect(config.border).toBeDefined();
    });
  });

  describe('Case-insensitivity & whitespace normalization', () => {
    it.each([
      ['LEETCODE', 'leetcode'],
      ['CodeForces', 'codeforces'],
      ['cOdEcHeF', 'codechef'],
      ['KAGGLE', 'kaggle'],
      ['CtFtiMe', 'ctftime'],
    ])('matches "%s" regardless of casing to "%s" config', (rawInput, expectedKey) => {
      const config = getPlatformConfig(rawInput);
      expect(config).toEqual(PLATFORM_MAP[expectedKey]);
    });

    it('matches platform keys embedded with surrounding whitespace', () => {
      const config = getPlatformConfig('   leetcode   ');
      expect(config).toEqual(PLATFORM_MAP['leetcode']);
    });
  });

  describe('URL, hostname, and subdomain matching', () => {
    it.each([
      ['https://leetcode.com/contest', 'leetcode'],
      ['https://codeforces.com/contests', 'codeforces'],
      ['practice.geeksforgeeks.org', 'geeksforgeeks'],
      ['naukri.com/code360', 'code360'],
      ['https://www.kaggle.com/competitions', 'kaggle'],
      ['ctftime.org/event/1234', 'ctftime'],
    ])('matches url/host "%s" to platform key "%s"', (urlInput, expectedKey) => {
      const config = getPlatformConfig(urlInput);
      expect(config).toEqual(PLATFORM_MAP[expectedKey]);
    });
  });

  describe('Fallback behavior for unknown or empty platforms', () => {
    it.each([
      ['unknown-online-judge'],
      ['random_platform_xyz'],
      ['custom-host.com'],
      [''],
      ['   '],
    ])('returns DEFAULT_PLATFORM_CONFIG for unrecognized input: "%s"', (input) => {
      const config = getPlatformConfig(input);
      expect(config).toEqual(DEFAULT_PLATFORM_CONFIG);
      expect(config.category).toBe('Other');
      expect(config.priority).toBe('More');
      expect(config.color).toBe('#a1a1aa');
    });
  });
});
