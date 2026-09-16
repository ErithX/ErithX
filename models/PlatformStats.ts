import mongoose from 'mongoose';

// LeetCode Stats Schema
const LeetCodeStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Supabase UUID
  handle: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  
  overview: {
    totalSolved: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 },
    contestRating: { type: Number, default: 0 },
  },
  calendar: { type: Map, of: Number, default: {} }, // {"2026-08-01": 5}
  topTags: [{ 
    tag: String, 
    count: Number 
  }],
  history: [{
    date: { type: Date, default: Date.now },
    totalSolved: Number,
    contestRating: Number
  }],
  recentSubmissions: [{ 
    title: String, 
    difficulty: String, 
    status: String, 
    timestamp: Date 
  }]
}, { timestamps: true });

// Codeforces Stats Schema
const CodeforcesStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  handle: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  
  rating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  rank: { type: String, default: 'unrated' },
  maxRank: { type: String, default: 'unrated' },
  contribution: { type: Number, default: 0 },
  
  ratingHistory: [{ 
    contestId: Number, 
    rank: Number, 
    oldRating: Number, 
    newRating: Number, 
    date: Date 
  }],
  recentSubmissions: [{ 
    title: String, 
    difficulty: String, 
    status: String, 
    contestId: Number,
    timestamp: Date 
  }]
}, { timestamps: true });

// GitHub Stats Schema
const GithubStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  username: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  
  overview: {
    followers: { type: Number, default: 0 },
    publicRepos: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    totalContributionsLastYear: { type: Number, default: 0 }
  },
  topLanguages: [{ 
    language: String, 
    percentage: Number 
  }],
  topRepos: [{ 
    name: String, 
    stars: Number, 
    language: String, 
    url: String, 
    description: String 
  }],
  recentEvents: [{
    type: { type: String }, // e.g., 'PushEvent', 'PullRequestEvent'
    repoName: String,
    createdAt: Date
  }]
}, { timestamps: true });

// CodeChef Stats Schema (Added as requested)
const CodeChefStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  handle: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  
  rating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  stars: { type: String, default: '1★' },
  globalRank: { type: Number, default: 0 },
  countryRank: { type: Number, default: 0 },
  
  recentSubmissions: [{ 
    title: String, 
    difficulty: String, 
    status: String, 
    timestamp: Date 
  }]
}, { timestamps: true });

export const LeetCodeStats = mongoose.models.LeetCodeStats || mongoose.model('LeetCodeStats', LeetCodeStatsSchema);
export const CodeforcesStats = mongoose.models.CodeforcesStats || mongoose.model('CodeforcesStats', CodeforcesStatsSchema);
export const GithubStats = mongoose.models.GithubStats || mongoose.model('GithubStats', GithubStatsSchema);
export const CodeChefStats = mongoose.models.CodeChefStats || mongoose.model('CodeChefStats', CodeChefStatsSchema);
