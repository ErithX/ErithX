export interface StaggerDelayOptions {
  jobsPerSecond?: number;
  maxDelaySeconds?: number;
}

export function calculateStaggerDelay(
  index: number,
  options?: StaggerDelayOptions
): number {
  if (index <= 0) return 0;

  const jobsPerSecond = options?.jobsPerSecond ?? 1.5;
  if (jobsPerSecond <= 0) return 0;

  const rawDelay = Math.floor(index / jobsPerSecond);

  if (options?.maxDelaySeconds !== undefined) {
    return Math.min(rawDelay, options.maxDelaySeconds);
  }

  return rawDelay;
}
