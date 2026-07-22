export type Category = 'DSA & CP' | 'AI / ML' | 'Cybersecurity (CTF)' | 'Other';
export type Priority = 'Hot' | 'Recommended' | 'More';

export interface PlatformConfig {
  category: Category;
  priority: Priority;
  color: string;
  bg: string;
  border: string;
}

export const PLATFORM_MAP: Record<string, PlatformConfig> = {
  // DSA & CP
  'leetcode': { category: 'DSA & CP', priority: 'Hot', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
  'codeforces': { category: 'DSA & CP', priority: 'Hot', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  'codechef': { category: 'DSA & CP', priority: 'Hot', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
  'geeksforgeeks': { category: 'DSA & CP', priority: 'Hot', color: '#16a34a', bg: 'rgba(22,163,74,0.1)', border: 'rgba(22,163,74,0.2)' },
  'gfg': { category: 'DSA & CP', priority: 'Hot', color: '#16a34a', bg: 'rgba(22,163,74,0.1)', border: 'rgba(22,163,74,0.2)' },
  'hackerrank': { category: 'DSA & CP', priority: 'Hot', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  'atcoder': { category: 'DSA & CP', priority: 'Recommended', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)' },
  'code360': { category: 'DSA & CP', priority: 'Recommended', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)' },
  'naukri': { category: 'DSA & CP', priority: 'Recommended', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)' },
  'nowcoder': { category: 'DSA & CP', priority: 'Recommended', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
  'dmoj': { category: 'DSA & CP', priority: 'Recommended', color: '#facc15', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.2)' },
  'topcoder': { category: 'DSA & CP', priority: 'Recommended', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  'codingame': { category: 'DSA & CP', priority: 'Recommended', color: '#fcd34d', bg: 'rgba(252,211,77,0.1)', border: 'rgba(252,211,77,0.2)' },
  'projecteuler': { category: 'DSA & CP', priority: 'Recommended', color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.2)' },
  'luogu': { category: 'DSA & CP', priority: 'More', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
  'yandex': { category: 'DSA & CP', priority: 'More', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  'eolymp': { category: 'DSA & CP', priority: 'More', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
  'kattis': { category: 'DSA & CP', priority: 'More', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  'spoj': { category: 'DSA & CP', priority: 'More', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  'toki': { category: 'DSA & CP', priority: 'More', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
  'uoj': { category: 'DSA & CP', priority: 'More', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  'qoj': { category: 'DSA & CP', priority: 'More', color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.2)' },
  'vjudge': { category: 'DSA & CP', priority: 'More', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  'acmp': { category: 'DSA & CP', priority: 'More', color: '#6ee7b7', bg: 'rgba(110,231,183,0.1)', border: 'rgba(110,231,183,0.2)' },
  'timus': { category: 'DSA & CP', priority: 'More', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  'kep': { category: 'DSA & CP', priority: 'More', color: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.2)' },

  // AI / ML
  'kaggle': { category: 'AI / ML', priority: 'Hot', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)' },
  'drivendata': { category: 'AI / ML', priority: 'Recommended', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)' },

  // Cybersecurity
  'ctftime': { category: 'Cybersecurity (CTF)', priority: 'Recommended', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
};

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  category: 'Other',
  priority: 'More',
  color: '#a1a1aa',
  bg: 'rgba(161,161,170,0.1)',
  border: 'rgba(161,161,170,0.2)',
};

export function getPlatformConfig(platformName: string): PlatformConfig {
  const normalized = platformName.toLowerCase();

  for (const [key, config] of Object.entries(PLATFORM_MAP)) {
    if (normalized.includes(key)) {
      return config;
    }
  }

  return DEFAULT_PLATFORM_CONFIG;
}
