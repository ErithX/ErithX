# API Rules & Limitations Guide

When scaling the platform, we need to be very careful with third-party APIs to avoid our servers getting IP-banned. Here is the breakdown of the APIs we use, their limitations, and strategies to handle them.

## 1. LeetCode (GraphQL API)
- **Endpoint**: `https://leetcode.com/graphql`
- **Rate Limit**: Not officially documented, but they use Cloudflare and will aggressively IP-ban if you send too many requests in a short burst.
- **Current Status**: We use their public GraphQL endpoint.
- **Scaling Strategy**:
  - Cache responses in MongoDB for at least 24 hours.
  - Do not trigger verifications on every keystroke (we currently use a 450ms debounce).
  - If we hit a `429 Too Many Requests`, we should fall back to the cached database value instead of failing the UI.

## 2. GitHub (REST API)
- **Endpoint**: `https://api.github.com/users/{handle}`
- **Rate Limit**: 60 requests per hour per IP (Unauthenticated). 
- **Scaling Strategy**:
  - **CRITICAL**: Once you have real users, 60 req/hour will be exhausted instantly.
  - You must generate a **Personal Access Token (PAT)** on GitHub and add it to the backend as a Bearer token. This increases the limit to **5,000 requests per hour**.
  - Cache the `avatar_url` and `public_repos` in our database.

## 3. Codeforces (REST API)
- **Endpoint**: `https://codeforces.com/api/user.info?handles={handle}`
- **Rate Limit**: 1 request per second (5 requests per second absolute max).
- **Current Status**: Very reliable but strictly rate-limited.
- **Scaling Strategy**:
  - Never batch-request multiple users at once without a delay queue.
  - Cache ratings for 24-48 hours since they only change after contests.

## 4. X (Twitter)
- **Endpoint**: *No public unauthenticated API exists.*
- **Limitations**: Since Elon Musk took over, the free API tier is extremely restrictive, and public unauthenticated endpoints were completely shut down.
- **Verification Strategy**: We cannot fetch their avatar or real name without a Paid API Key (or making users "Sign in with Twitter").
- **Current Implementation**: We rely on **Regex validation** (`x.com/username` or `twitter.com/username`) to ensure the link is structurally valid.

## 5. LinkedIn
- **Endpoint**: *No public API exists.*
- **Limitations**: LinkedIn heavily guards its data. Any attempt to scrape `linkedin.com/in/{handle}` via a server will result in a `999 Request Denied` error or an Auth Wall.
- **Verification Strategy**: Similar to X, we can only verify the structural validity of the URL using Regex (e.g., must match `linkedin.com/in/`). To get their avatar, the user would explicitly have to "Sign in with LinkedIn" using OAuth.

---

### Anti-Spam Recommendations for Version 3
1. **Rate Limiting**: Implement Upstash Redis (or similar) rate-limiting on the `/api/user/profiles/verify` endpoint (e.g., max 10 verifications per IP per minute).
2. **Debounce Optimization**: We currently use 450ms. If users spam, we can increase this to 1000ms.
3. **Caching Layer**: Do not verify profiles if they were successfully verified within the last 24 hours. Pull from the database `UserCoderProfile` instead.
