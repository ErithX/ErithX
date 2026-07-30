export type EmailSubjectFamily = 'direct' | 'calm' | 'signal' | 'personalized' | 'supportive' | 'curiosity' | 'platform' | 'variety';

export interface EmailSubjectTemplate {
  id: string;
  family: EmailSubjectFamily;
  text: string;
}

export const CONTEST_ALERT_SUBJECTS: EmailSubjectTemplate[] = [
  // Direct + Clear
  { id: 'ca_dir_1', family: 'direct', text: '{{contest_name}} starts in 30 min' },
  { id: 'ca_dir_2', family: 'direct', text: '{{platform}} contest in 30 minutes' },
  { id: 'ca_dir_3', family: 'direct', text: '{{contest_name}} · starts soon' },
  { id: 'ca_dir_4', family: 'direct', text: 'Your contest starts in {{minutes_left}} min' },

  // Calm Urgency (no panic)
  { id: 'ca_calm_1', family: 'calm', text: '{{contest_name}} in 30 min — no rush needed' },
  { id: 'ca_calm_2', family: 'calm', text: 'Heads up: {{contest_name}} starts soon' },
  { id: 'ca_calm_3', family: 'calm', text: '{{contest_name}} begins in 30 minutes' },
  { id: 'ca_calm_4', family: 'calm', text: 'Gentle reminder: contest in 30 min' },

  // Signal / Value-first
  { id: 'ca_sig_1', family: 'signal', text: '{{contest_name}} · good for {{signal}}' },
  { id: 'ca_sig_2', family: 'signal', text: '{{platform}} contest · strong hiring signal' },
  { id: 'ca_sig_3', family: 'signal', text: '{{contest_name}} — solid practice round' },
  { id: 'ca_sig_4', family: 'signal', text: 'High-signal contest starts in 30 min' },

  // Personalized
  { id: 'ca_per_1', family: 'personalized', text: '{{first_name}}, {{contest_name}} starts in 30' },
  { id: 'ca_per_2', family: 'personalized', text: '{{first_name}} — contest matching your focus in 30 min' },
  { id: 'ca_per_3', family: 'personalized', text: 'Your focus contest starts soon' },
  { id: 'ca_per_4', family: 'personalized', text: '{{first_name}}, {{contest_name}} is almost here' },

  // Low-burnout / Supportive
  { id: 'ca_sup_1', family: 'supportive', text: 'Just show up — {{contest_name}} in 30' },
  { id: 'ca_sup_2', family: 'supportive', text: 'No pressure: {{contest_name}} starts soon' },
  { id: 'ca_sup_3', family: 'supportive', text: '{{contest_name}} in 30 min. You’ve got this' },
  { id: 'ca_sup_4', family: 'supportive', text: 'One contest. Starts in 30' },

  // Curiosity / Soft
  { id: 'ca_cur_1', family: 'curiosity', text: 'Ready when you are — contest in 30' },
  { id: 'ca_cur_2', family: 'curiosity', text: '{{contest_name}} is about to drop' },
  { id: 'ca_cur_3', family: 'curiosity', text: 'Something good starts in 30 minutes' },
  { id: 'ca_cur_4', family: 'curiosity', text: 'Your next contest is almost live' },

  // Platform + Specificity
  { id: 'ca_plat_1', family: 'platform', text: 'DSA Quest alert: {{contest_name}} in 30' },
  { id: 'ca_plat_2', family: 'platform', text: '{{platform}} · {{contest_name}} starts soon' },
  { id: 'ca_plat_3', family: 'platform', text: 'Codeforces Round coming up in 30 min' },
  { id: 'ca_plat_4', family: 'platform', text: 'LeetCode contest starts in 30 minutes' },

  // Extra variety
  { id: 'ca_var_1', family: 'variety', text: '{{contest_name}} · 30 min left to join' },
  { id: 'ca_var_2', family: 'variety', text: 'Contest drop in 30 — {{signal}} focus ✨' },
];

export const DAILY_DIGEST_SUBJECTS: EmailSubjectTemplate[] = [
  // Value-first + Signal
  { id: 'dd_sig_1', family: 'signal', text: 'Tomorrow’s contests + one sharp tip' },
  { id: 'dd_sig_2', family: 'signal', text: '{{count}} contests worth your time tomorrow' },
  { id: 'dd_sig_3', family: 'signal', text: 'Only the high-signal ones for tomorrow' },
  { id: 'dd_sig_4', family: 'signal', text: 'Clean contest drop for tomorrow ⚡' },
  { id: 'dd_sig_5', family: 'signal', text: 'Tomorrow’s lineup — filtered for you' },

  // Personalized
  { id: 'dd_per_1', family: 'personalized', text: '{{first_name}}, your contest drop is ready' },
  { id: 'dd_per_2', family: 'personalized', text: '{{first_name}} — {{count}} matches for your focus' },
  { id: 'dd_per_3', family: 'personalized', text: 'Contests matching your focus tomorrow' },
  { id: 'dd_per_4', family: 'personalized', text: 'Your personalized contest list is here' },
  { id: 'dd_per_5', family: 'personalized', text: '{{first_name}}, tomorrow looks solid' },

  // Curiosity + Soft Energy
  { id: 'dd_cur_1', family: 'curiosity', text: 'What’s actually worth solving tomorrow' },
  { id: 'dd_cur_2', family: 'curiosity', text: 'Tomorrow’s contests (no filler)' },
  { id: 'dd_cur_3', family: 'curiosity', text: 'A calm look at tomorrow’s contests' },
  { id: 'dd_cur_4', family: 'curiosity', text: 'Just the useful ones for tomorrow ✨' },
  { id: 'dd_cur_5', family: 'curiosity', text: 'Tomorrow’s contests, cleaned up' },

  // Specific + Actionable
  { id: 'dd_dir_1', family: 'direct', text: 'Codeforces + LeetCode drop for tomorrow' },
  { id: 'dd_dir_2', family: 'direct', text: '{{count}} strong contests + 1 hiring challenge' },
  { id: 'dd_dir_3', family: 'direct', text: 'Tomorrow: speed practice + hiring signal' },
  { id: 'dd_dir_4', family: 'direct', text: 'Your next 24h contest plan' },
  { id: 'dd_dir_5', family: 'direct', text: 'Contests that actually move the needle' },

  // Low-burnout / Supportive
  { id: 'dd_sup_1', family: 'supportive', text: 'No overwhelm — just tomorrow’s best' },
  { id: 'dd_sup_2', family: 'supportive', text: 'Easy scan: tomorrow’s contests' },
  { id: 'dd_sup_3', family: 'supportive', text: 'Tomorrow’s contests. Zero pressure.' },
  { id: 'dd_sup_4', family: 'supportive', text: 'Light load for tomorrow 🔥' },
  { id: 'dd_sup_5', family: 'supportive', text: 'Show up if you want — contests inside' },

  // Platform + Freshness
  { id: 'dd_plat_1', family: 'platform', text: 'DSA Quest daily: tomorrow’s contests' },
  { id: 'dd_plat_2', family: 'platform', text: 'Fresh contest list for tomorrow 👀' },
  { id: 'dd_plat_3', family: 'platform', text: 'Daily drop: high-signal contests only' },
  { id: 'dd_plat_4', family: 'platform', text: 'Tomorrow’s contests are live' },
  { id: 'dd_plat_5', family: 'platform', text: 'Your daily contest brief is ready 📅' },
];

export function selectNextSubject(
  pool: EmailSubjectTemplate[],
  recentSubjectIds: string[] = [],
  windowSize: number = 15
): EmailSubjectTemplate {
  if (!pool || pool.length === 0) {
    throw new Error("Subject pool is empty");
  }

  // 1. Get the last N subjects (the window)
  const recentWindowIds = recentSubjectIds.slice(-windowSize);

  // 2. Exclude those last N subjects
  let available = pool.filter(s => !recentWindowIds.includes(s.id));

  // If we somehow filtered out everything (e.g. pool is smaller than window), fallback to the full pool
  if (available.length === 0) {
    available = [...pool];
  }

  // 3. Try to avoid the family of the most recent 1-2 subjects
  const mostRecentIds = recentSubjectIds.slice(-2);
  const mostRecentFamilies = pool
    .filter(s => mostRecentIds.includes(s.id))
    .map(s => s.family);

  let diverseAvailable = available.filter(s => !mostRecentFamilies.includes(s.family));
  
  // If excluding recent families leaves us with nothing, fall back to available
  if (diverseAvailable.length === 0) {
    diverseAvailable = available;
  }

  // 4. Pick randomly from the remaining
  const randomIndex = Math.floor(Math.random() * diverseAvailable.length);
  return diverseAvailable[randomIndex];
}

export function formatSubject(template: string, data: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  // Clean up unused tags if any data is missing (e.g., if {{first_name}} is not provided)
  result = result.replace(/{{[^}]+}}/g, 'Coder'); 
  return result;
}
