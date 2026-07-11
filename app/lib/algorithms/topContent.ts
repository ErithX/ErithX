/**
 * Top Content Ranking Algorithm
 * 
 * Calculates an engagement score for a resource to determine its ranking.
 * This abstracts the logic away from the UI so we can easily tweak the formula
 * in the future (e.g., adding decay over time, CTR, etc.) without touching UI components.
 * 
 * Current Logic (Phase 1):
 * - 80% realViews (Actual clicks into the resource)
 * - 5%  views (Feed impressions)
 * - 10% upvotes (Quality indicator)
 * - 5%  comments (Discussion indicator)
 * 
 * To avoid floating point math, we use relative weights (multiplier):
 * realViews * 16 + views * 1 + upvotes * 2 + comments * 1
 */

export function calculateEngagementScore(resource: any): number {
  const realViews = resource.realViews || 0;
  const views = resource.views || 0;
  const upvotes = resource.upvotes || 0;
  const comments = resource.commentsCount || 0;

  // The weights reflect the percentages (80, 5, 10, 5) simplified by dividing by 5.
  const score = (realViews * 16) + (views * 1) + (upvotes * 2) + (comments * 1);
  
  return score;
}
