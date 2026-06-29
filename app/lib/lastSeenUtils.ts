export function formatLastSeen(lastSeenIso: string | null): string {
  if (!lastSeenIso) return 'Never';

  const lastSeenDate = new Date(lastSeenIso);
  const now = new Date();
  
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // If active in the last 60 seconds (accounting for 45s polling + buffer)
  if (diffSeconds < 60) {
    return '🟢 Online';
  }

  if (diffMinutes < 60) {
    return `Last seen ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  }

  if (diffHours < 24) {
    return `Last seen ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }

  if (diffDays === 1) {
    return 'Last seen yesterday';
  }

  if (diffDays < 7) {
    return `Last seen ${diffDays} days ago`;
  }

  // Fallback to local date string for older timestamps
  return `Last seen on ${lastSeenDate.toLocaleDateString()}`;
}
