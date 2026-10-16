export function calculateCycleKey(date: Date = new Date()): string {
  const utcDay = date.getUTCDay();
  const daysToSubtract = utcDay === 0 ? 0 : utcDay;

  const sundayAnchor = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - daysToSubtract
    )
  );

  const year = sundayAnchor.getUTCFullYear();
  const month = String(sundayAnchor.getUTCMonth() + 1).padStart(2, '0');
  const day = String(sundayAnchor.getUTCDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

export function buildDeduplicationId(userId: string, cycleKey: string): string {
  const cleanUserId = (userId || '').trim();
  const cleanCycleKey = (cycleKey || '').trim();

  if (!cleanUserId || !cleanCycleKey) {
    throw new Error('Both userId and cycleKey are required to build deduplicationId');
  }

  return `review-${cleanCycleKey}-${cleanUserId}`;
}

export function getCycleBounds(cycleKey: string): { startOfWeek: Date; endOfWeek: Date } {
  if (!/^\d{8}$/.test(cycleKey)) {
    throw new Error(`Invalid cycleKey format: ${cycleKey}. Expected YYYYMMDD.`);
  }

  const year = parseInt(cycleKey.slice(0, 4), 10);
  const month = parseInt(cycleKey.slice(4, 6), 10) - 1;
  const day = parseInt(cycleKey.slice(6, 8), 10);

  const startOfWeek = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const endOfWeek = new Date(Date.UTC(year, month, day + 6, 23, 59, 59, 999));

  return { startOfWeek, endOfWeek };
}
