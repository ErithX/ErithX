# Distributed Adaptive Rate Limiter + API Gateway

## Why this project?

Rate limiting is a core system design interview question at FAANG companies. Most students use pre-built libraries or NGINX wrappers—you'll build from scratch with atomic Redis Lua scripts and adaptive thresholds that adjust to real-world latency. That signals depth.

## What you will learn

- Distributed algorithms (sliding-window counter math)
- Atomic operations (Redis Lua atomicity)
- Concurrent systems design
- Proxy patterns
- Circuit breakers
- PostgreSQL caching strategies

## Target companies

Google, Meta, Amazon, Stripe, Uber, Netflix, Airbnb.

## Overview

Rate limiting comes up constantly in system design interviews at FAANG companies, but most student projects just wrap NGINX or use a pre-built library — which reads as "I followed the tutorial, not I understand the system." This guide is different: we're building a **distributed adaptive rate limiter and API gateway from scratch**, with a Redis Lua sliding-window-counter engine, thresholds that self-adjust based on real-time latency, a dashboard that shows quota consumption, and full observability with OpenTelemetry. By the end, you'll have a portfolio project that signals genuine backend systems depth.

---

## Index / Table of Contents

- [2. Core Concepts: Understanding Rate Limiting](#2-core-concepts-understanding-rate-limiting)
  - [2.1 What Rate Limiting Does](#21-what-rate-limiting-does)
  - [2.2 Rate Limiting Algorithms Compared](#22-rate-limiting-algorithms-compared)
  - [2.3 Why We Pick Sliding Window Counter](#23-why-we-pick-sliding-window-counter)
  - [2.4 Why Redis Lua Scripts Matter](#24-why-redis-lua-scripts-matter)
- [3. Architecture and Design Decisions](#3-architecture-and-design-decisions)
  - [3.1 System Architecture Overview](#31-system-architecture-overview)
  - [3.2 The Request Journey](#32-the-request-journey)
  - [3.3 Key Design Decisions](#33-key-design-decisions)
- [4. Environment Setup: From Zero to Ready](#4-environment-setup-from-zero-to-ready)
  - [4.1 What You'll Need](#41-what-youll-need)
  - [4.2 Getting Started in 5 Steps](#42-getting-started-in-5-steps)
  - [4.3 Project Structure](#43-project-structure)
- [5. Building the Rate Limiter Engine](#5-building-the-rate-limiter-engine)
  - [5.1 The Sliding Window Counter Algorithm](#51-the-sliding-window-counter-algorithm)
  - [5.2 The Lua Script: Atomicity in Action](#52-the-lua-script-atomicity-in-action)
  - [5.3 Key Naming and Cleanup](#53-key-naming-and-cleanup)
- [6. Building the API Gateway Layer](#6-building-the-api-gateway-layer)
  - [6.1 The Gateway's Job](#61-the-gateways-job)
  - [6.2 Client Identification](#62-client-identification)
  - [6.3 Error Handling: Fail-Open vs. Fail-Closed](#63-error-handling-fail-open-vs-fail-closed)
- [7. Adaptive Rate Limiting](#7-adaptive-rate-limiting)
  - [7.1 Why Static Limits Aren't Enough](#71-why-static-limits-arent-enough)
  - [7.2 How It Works](#72-how-it-works)
- [8. Dashboard and User Retention Features](#8-dashboard-and-user-retention-features)
  - [8.1 Why a Dashboard Matters](#81-why-a-dashboard-matters)
  - [8.2 PDF Exports for Reach](#82-pdf-exports-for-reach)
- [9. Observability with OpenTelemetry](#9-observability-with-opentelemetry)
  - [9.1 Why You Need It](#91-why-you-need-it)
  - [9.2 The Metrics That Matter](#92-the-metrics-that-matter)
- [10. Error Handling and Testing Strategy](#10-error-handling-and-testing-strategy)
  - [10.1 The Gotchas](#101-the-gotchas)
  - [10.2 How to Test It](#102-how-to-test-it)
- [11. Deployment and README Optimization](#11-deployment-and-readme-optimization)
  - [11.1 Shipping the Full Stack](#111-shipping-the-full-stack)
  - [11.2 The README That Gets Read](#112-the-readme-that-gets-read)
- [12. Resources and References](#12-resources-and-references)
  - [12.1 The One Book You Need](#121-the-one-book-you-need)
  - [12.2 Official Docs Worth Reading](#122-official-docs-worth-reading)
  - [12.3 Code Reference on GitHub](#123-code-reference-on-github)
  - [12.4 Video Walkthrough (If You Learn by Watching)](#124-video-walkthrough-if-you-learn-by-watching)
  - [12.5 Deep Dives (Optional, But Strong)](#125-deep-dives-optional-but-strong)
- [13. Conclusions and Next Steps](#13-conclusions-and-next-steps)
  - [Next Steps to Level Up](#next-steps-to-level-up)
  - [Final Thought](#final-thought)

---

## 2. Core Concepts: Understanding Rate Limiting

### 2.1 What Rate Limiting Does

**Theoretically:** you count requests and reject the ones that exceed a threshold.

**Practically:** when a client hits their quota, we return `HTTP 429 Too Many Requests` with headers telling them when they can retry. The real value is protecting your upstream services from melting under load, keeping resource usage predictable, and stopping bad actors from DoS-ing you. **It's a safety guardrail, not a punishment feature** — the goal is to say "not now, try again in 5 seconds" rather than "you're banned."

**But watch out for:** if you get it wrong, legitimate users bounce and take their trust with them. The timing of rate limit errors matters more than the accuracy of counting.

### 2.2 Rate Limiting Algorithms Compared

| Algorithm | The Idea | Pros | Cons |
| --- | --- | --- | --- |
| **Fixed Window** | Restart the counter every minute | Dead simple | Traffic spikes at boundary (2x at minute edges) |
| **Sliding Window Log** | Store every request timestamp | Perfect accuracy | Eats memory at scale |
| **Sliding Window Counter** | Two fixed windows + weighted average | Accurate + cheap | Slightly fuzzy math |
| **Token Bucket** | Tokens refill over time, requests spend them | Natural burst handling | Tuning complexity |
| **Leaky Bucket** | Process requests at a constant rate | Smooth output | Adds queue latency |

### 2.3 Why We Pick Sliding Window Counter

**Theoretically:** we need accuracy without memory waste.

**Practically:** the sliding window counter uses only two Redis counters and a bit of math to estimate whether the current request fits. No per-request storage, constant time and memory per check, and **the overhead is sub-millisecond** — fast enough that the rate limiter itself isn't the bottleneck. For a gateway handling thousands of requests per second, that matters.

**But watch out for:** the math is an estimate, not perfect. If you need absolute precision (financial transactions), you'd pay the memory cost for a full sliding-window-log. For API rate limiting, the estimate is close enough.

### 2.4 Why Redis Lua Scripts Matter

**Theoretically:** atomicity means no race conditions.

**Practically:** a naive rate limiter needs at least two commands: increment the counter, then set expiration. Between those two commands, another thread could read the counter before we've set the TTL, causing the key to live forever and leak memory. Lua scripts in Redis execute atomically — the entire script runs before any other command gets a turn. **One network round-trip, guaranteed correctness, sub-millisecond latency.** That's why Lua is the standard for this.

**But watch out for:** Lua scripts add complexity. If your script is buggy, it's buggy in a way that's hard to debug. Keep them short and test them thoroughly.

## 3. Architecture and Design Decisions

### 3.1 System Architecture Overview

**Theoretically:** rate limiting is just "count requests, reject if over limit."

**Practically:** the system has five layers. The **API Gateway** (Node.js) routes incoming requests, the **Rate Limiter Engine** checks Redis with atomic Lua scripts, **PostgreSQL** stores endpoint configs and audit logs, the **Admin Dashboard** shows quota usage and lets you tweak rules, and **OpenTelemetry** instruments everything so you can see latency, throughput, and errors in real time.

**But watch out for:** each layer adds moving parts. Don't over-engineer it at first — get the gateway + Redis layer working, then add PostgreSQL for persistence, then instrument it.

### 3.2 The Request Journey

A request arrives → the gateway extracts the client ID (API key or IP) → looks up the endpoint config → calls the Redis Lua script with `client_id, endpoint, current_timestamp` → the script returns allowed or denied, with remaining quota and reset time → if allowed, we forward to upstream and return the response with rate-limit headers; if blocked, we return 429 immediately. **The critical insight:** we never touch the upstream service if the rate limit is exceeded, so a DoS attack doesn't exhaust your real resources.

### 3.3 Key Design Decisions

| Decision | We Chose | Why | The Trade-off |
| --- | --- | --- | --- |
| Build or wrap | Build from scratch in Node.js | Deep understanding + interview talking points + full control | More code to write than wrapping NGINX |
| Rate-limit state | Redis + Lua scripts | Sub-millisecond atomic operations, single network round-trip | Adds Redis as a dependency |
| Config storage | PostgreSQL | Relational queries for the dashboard, strong ACID guarantees | Slightly higher latency than pure Redis |
| Containers | Docker Compose | Reproducible local dev, easy to deploy | Networking can be fiddly at first |
| Observability | OpenTelemetry | Vendor-neutral, no vendor lock-in, unified traces/metrics | Setup effort upfront |

**Each choice is a conversation, not a decree.** If you want to start with NGINX or skip OpenTelemetry, you can—just own that trade-off in your README.

## 4. Environment Setup: From Zero to Ready

### 4.1 What You'll Need

Node.js LTS 20+, Docker Desktop (or Docker Engine on Linux), and a code editor — that's it. Use fnm (or nvm) to manage Node versions so you don't mess with your system install.

### 4.2 Getting Started in 5 Steps

**Step 1:** Install Node and verify it works.

```bash
fnm install 20
node -v
npm -v
```

**Step 2:** Install Docker Desktop and verify it starts.

```bash
docker version
```

**Step 3:** Create your project and install dependencies.

```bash
mkdir rate-limiter-gateway && cd rate-limiter-gateway
npm init -y
npm install express ioredis pg
npm install -D typescript ts-node
```

**Step 4:** Create `docker-compose.yml` with Redis and PostgreSQL. We use Alpine images (lightweight), named volumes (persistent data), and expose ports only to localhost (safe for local dev).

```yaml
version: '3.9'
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ratelimiter
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
volumes:
  redis-data:
  postgres-data:
```

**Step 5:** Start the stack and test connectivity.

```bash
docker compose up -d
redis-cli ping
psql -h localhost -U admin -d ratelimiter -c "SELECT 1"
```

**But watch out for:** port conflicts if you already have Redis or Postgres running locally. If `docker compose up` fails, check `docker compose logs` to see what happened.

### 4.3 Project Structure

Create these directories to keep things organized:

```
src/
  gateway/
  rate-limiter/
  config/
  dashboard/
  lua/
docker/
tests/
```

Keep the Lua scripts in `src/lua/` so they're easy to version-control and test separately.

## 5. Building the Rate Limiter Engine

### 5.1 The Sliding Window Counter Algorithm

**Theoretically:** count requests in two adjacent time windows, blend them with a weighted average.

Practically: say the window is 60 seconds.

We keep two counters in Redis:

- one for the current minute (0:00-1:00)
- one for the previous minute (59:00-60:00)

When a new request arrives at timestamp T, we calculate:

**estimated_count = (prev_window_count × fraction_of_prev_elapsed) + current_window_count.**

If estimated_count < limit, we increment current_window and allow the request. Otherwise, we reject it with HTTP 429.

The magic: we use only **two Redis keys total, not one key per request.** O(1) memory and time. The weighted average isn't perfect (it's off by a few percent), but that's fine for rate limiting—humans aren't that precise anyway.

**But watch out for:** clock skew between servers. If your gateway instances have different system times, the window calculations will diverge. **Always use the Redis server time as the source of truth**, not your local app-server clock.

### 5.2 The Lua Script: Atomicity in Action

Here's the skeleton of what we'll write in Redis:

```lua
-- Input: clientId, endpoint, limit, window_seconds, current_time
-- Output: allowed (boolean), remaining (int), reset_time (timestamp)

local key_current = "limit:".. clientId .. ":".. endpoint .. ":current"
local key_previous = "limit:".. clientId .. ":".. endpoint .. ":prev"

-- Fetch counts (default 0 if key doesn't exist)
local count_current = tonumber(redis.call('GET', key_current)) or 0
local count_previous = tonumber(redis.call('GET', key_previous)) or 0

-- Weighted average
local elapsed_frac = math.fmod(current_time, window_seconds) / window_seconds
local estimated = count_previous * (1 - elapsed_frac) + count_current

-- Decision
local allowed = estimated < limit
if allowed then
  redis.call('INCR', key_current)
  redis.call('EXPIRE', key_current, window_seconds * 2)
  redis.call('EXPIRE', key_previous, window_seconds * 2)
end

return {allowed, limit - estimated, current_time + (window_seconds * (1 - elapsed_frac))}
```

**The critical part:** this entire script runs atomically on the Redis server. No other command runs between the GET and the INCR. **That guarantee eliminates race conditions.** One network round-trip, guaranteed correctness.

**But watch out for:** Lua scripts are black boxes once they're in Redis. Test them thoroughly in isolation before putting them in production. Write unit tests that mock Redis and verify the math.

### 5.3 Key Naming and Cleanup

Use a naming scheme that's easy to debug: `rate_limit:{clientId}:{endpoint}:{window}`. Set TTL to roughly **2x the window duration**—long enough for the previous-window key to survive until it's no longer needed, short enough to not waste memory. Redis will auto-delete expired keys, so you never have to worry about leaks.

## 6. Building the API Gateway Layer

### 6.1 The Gateway's Job

**Theoretically:** sit between client and upstream, check rate limits, forward if allowed.

**Practically:** when a request arrives, we extract the client ID (from an API key header or IP address), look up which endpoint they're hitting (from a PostgreSQL config table, cached in memory), call the Redis Lua script, and make a decision. If allowed, we proxy the request to the real upstream service, add rate-limit headers to the response (`X-RateLimit-Remaining`, `X-RateLimit-Limit`, `Retry-After`), and send it back. If blocked, we return 429 immediately—no upstream call, no wasted resources.

**But watch out for:** the caching layer. Refresh the endpoint config from PostgreSQL every 30 seconds or on a webhook, not on every request. Otherwise your gateway becomes a bottleneck waiting for database queries.

### 6.2 Client Identification

**Theoretically:** you need a way to identify who's making the request.

**Practically:** accept either an API key in the `Authorization` header or fall back to IP address. If using API keys, validate them against the database (or cache them in Redis with TTL). If using IP, be aware that **behind a load balancer, all traffic looks like it comes from the same IP**—you'll need to read the `X-Forwarded-For` header instead. Document this clearly so developers know what to expect.

**But watch out for:** IP spoofing. If your gateway is on the public internet and trusts client IPs blindly, someone can DOS one client by spoofing their IP. Use API keys for anything critical.

### 6.3 Error Handling: Fail-Open vs. Fail-Closed

**Theoretically:** when Redis goes down, do you block all requests or allow them all?

**Practically:** **fail-open with logging.** If Redis is unreachable, log a warning, emit a metric (so alerts fire), and permit the request. This prevents a single Redis outage from taking down your entire API gateway. Increment a circuit-breaker failure counter; if it hits a threshold (e.g., 5 consecutive failures), escalate to a higher-severity alert.

**But watch out for:** the trade-off. Fail-open means a DoS attacker has a window during a Redis outage. Fail-closed is safer but means your legitimate users are blocked during maintenance. Pick based on your risk tolerance—document the choice in your README so operators understand the behavior.

## 7. Adaptive Rate Limiting

### 7.1 Why Static Limits Aren't Enough

**Theoretically:** a fixed limit works until traffic patterns change.

**Practically:** set a hard limit, and you're guessing. Traffic spikes at noon, your services slow down, legitimate users hit the rate limit and bounce. You wake up at 3 AM to manually increase the limit. **Adaptive rate limiting watches your upstream p99 latency and adjusts the limit automatically,** tightening when systems get slow and loosening when they recover. You still set min/max bounds—the system just moves within that range.

**But watch out for:** oscillation. If your window is too short or your step size too large, limits will thrash up and down, confusing clients. Start conservative.

### 7.2 How It Works

Every 30 seconds, the adaptive engine wakes up and asks: "What's the current p99 latency of upstream services?" If it's above your target (e.g., 200ms), **nudge the limit down by 10%.** If it's below your target, nudge it up. Repeat.

The per-client limit drifts within your configured bounds (e.g., min 10 req/s, max 100 req/s). **When p99 spikes, aggressive clients naturally get squeezed harder because they hit the adjusted limit first.** Fair and automatic.

**But watch out for:** the feedback loop lag. If you adjust too aggressively, you'll overcorrect. Start with 30-second windows and 5–10% steps, then tune based on your specific traffic patterns.

## 8. Dashboard and User Retention Features

### 8.1 Why a Dashboard Matters

**Theoretically:** rate limiting is invisible when it works, frustrating when it doesn't.

**Practically:** give developers a dashboard that shows their quota usage in real time, a timeline of when they've been rate-limited, and which endpoints are hitting them hardest. **Make the limit feel transparent, not punitive.** A developer who can see "you're at 8,000 of 10,000 requests this hour" will self-regulate before hitting the wall. A developer who just gets 429s will get angry.

**But watch out for:** over-building. Start with a simple table of quota usage. Add fancy charts later if users actually ask for them.

### 8.2 PDF Exports for Reach

**Theoretically:** downloadable reports are just data in a different format.

**Practically:** a monthly audit report (traffic by endpoint, peak hours, rate-limit events) is **shareable**—a developer can forward it to their manager, post it to Slack, reference it in incident postmortems. That artifact gets your system name in front of more people. It also signals professionalism: "Look, this team cares about observability."

Export buttons with clear filenames (`ratelimit-audit-2026-07.pdf`) are low effort, high signal. Add them to your dashboard early.

**But watch out for:** performance. Generating large PDFs is slow. Do it asynchronously, queue it, and email the link to the user instead of making them wait for the browser download.

## 9. Observability with OpenTelemetry

### 9.1 Why You Need It

**Theoretically:** "it works" isn't enough—you need data to back it up.

**Practically:** instrument the critical path: request arrival → gateway → rate-limit check → upstream → response. Capture latency at each step as a histogram (so you can compute p50/p95/p99). When someone asks "why is our API slow?", you'll have traces showing whether it's the rate limiter, the upstream service, or network jitter.

**But watch out for:** telemetry overhead. Each trace adds latency. Use sampling—capture 10% of traffic in detail, rely on metrics (which are cheap) for the rest.

### 9.2 The Metrics That Matter

- **Gateway latency overhead:** should be sub-5ms (ideally sub-2ms). If the rate limiter is slower than that, it's the bottleneck.
- **Throughput:** how many requests per second can your gateway handle? Load test to find out, then document the number in your README.
- **False positive rate:** what fraction of legitimate requests are rate-limited? Monitor this—if it's above 1%, your limits are too tight.
- **Cache hit ratio:** how often is the endpoint config already in memory? Should be >99%.
- **End-to-end p99:** what does a user actually experience? Trace this from their perspective.

These four numbers are **your portfolio project's talking points.** In an interview, leading with "our rate limiter adds 2ms of latency and handles 50k req/s" signals engineering maturity.

## 10. Error Handling and Testing Strategy

### 10.1 The Gotchas

**Clock skew between servers:** if your gateway instances have different system times, the Lua script's window calculations diverge. **Solution: always use `redis.call('TIME')` inside the script, never local app time.** One canonical clock.

**Boundary bursts:** a sliding window counter isn't perfect—right at a window edge, estimates can be off by ~10%. **OK for rate limiting.** Mitigate by running the adaptive engine and smoothing big swings.

**Upstream timeouts:** if your upstream service is slow or hung, the gateway shouldn't wait forever. **Set a timeout (e.g., 10s default), track it as a metric, and return 504 if it expires.** The rate limit doesn't apply to slow upstreams—they do.

**Redis goes down:** covered in Section 6.3. Fail-open with circuit-breaker escalation.

### 10.2 How to Test It

**Unit tests:** test the Lua script in isolation against a real Redis instance (or a mock). Verify the math for boundary cases (request at t=0 vs. t=59s in a 60s window).

**Integration tests:** full request flow—request → gateway → rate-limit check → mock upstream → response. Verify headers are correct, 429 is returned on limit, and allowed requests reach upstream.

**Load tests:** use k6 or Artillery. Run three scenarios:

1. Sustained traffic at the configured limit (e.g., 1,000 req/s for 60s)—should have <1% error rate.
2. Burst traffic at 5x the limit (5,000 req/s for 5s)—should see ~80% requests blocked with 429.
3. Gradual ramp (from 100 to 5,000 req/s over 2 minutes)—watch latency and CPU.

Document the load-test numbers in your README. **These numbers are resume gold.**

## 11. Deployment and README Optimization

### 11.1 Shipping the Full Stack

**Theoretically:** people want to try your project, not debug setup for an hour.

**Practically:** use `docker-compose.yml` to ship everything—gateway, Redis, PostgreSQL, OpenTelemetry collector—in one command. A developer clones the repo and runs `docker compose up -d`, and the whole system is live on their machine in 30 seconds.

For the gateway Docker image, use a multi-stage build: stage one installs dependencies and compiles your code, stage two copies only the built artifacts into a tiny Alpine base image (saves 200MB). **Final image should be under 100MB.**

**But watch out for:** volume mounts. If you're developing locally, mount your source code into the container so changes reload instantly. Document this in your docker-compose.yml with comments.

### 11.2 The README That Gets Read

**Theoretically:** a README is documentation.

**Practically:** a README is marketing. It's the first thing people see on GitHub and in search results. **Structure it like this:**

1. **Title + one-liner** — what is it, why should I care?
2. **Architecture diagram** — client → gateway → rate limiter → upstream
3. **Quick start** — get it running in 5 minutes: `git clone ... && docker compose up -d`
4. **Load test results** — "Handles 50k req/s with <5ms overhead"
5. **Trade-offs** — what this does well, what it doesn't (fail-open behavior, Lua script limitations, etc.)
6. **How to extend it** — ideas for next steps (multi-region sync, anomaly detection, API key management)
7. **Links** — to the full guide, to relevant papers/blogs

Bold the key metrics and decisions so skimmers get the essence in 10 seconds. **README quality directly affects GitHub ranking and recruiter discovery.**

## 12. Resources and References

### 12.1 The One Book You Need

*Designing Data-Intensive Applications* by Martin Kleppmann. Read chapters 5–7 (replication, partitioning, consistency). This book explains *why* rate limiting matters in distributed systems—it's the theoretical foundation that makes everything in this guide click.

### 12.2 Official Docs Worth Reading

| Resource | What It Teaches |
| --- | --- |
| Redis Rate Limiting Tutorial | All 5 algorithms with Lua code |
| Redis Lua Scripting | How to write atomic scripts that don't race |
| OpenTelemetry Node.js Docs | Instrumentation from hello-world to production |
| Kong Blog: Scalable Rate Limiting | Real-world patterns used by Kong |

### 12.3 Code Reference on GitHub

- **redis-developer/redis-ratelimiting-js** — working TypeScript implementations of all 5 algorithms. Read this, don't just copy-paste.
- **express-rate-limit/rate-limit-redis** — how people integrate rate limiting into Express. Good for understanding the middleware pattern.
- **go-redis/redis_rate** — production Go implementation. Study this to see how a mature system handles edge cases.

### 12.4 Video Walkthrough (If You Learn by Watching)

- **"Design a Distributed Rate Limiter"** by System Design Interview — excellent full walkthrough, exactly the level of this guide.
- **"Build 5 Rate Limiters with Redis"** (Redis official channel) — hands-on, skip around to the sliding-window-counter section.
- **"OpenTelemetry in Node.js"** — if you want to see instrumentation in action.

### 12.5 Deep Dives (Optional, But Strong)

- GitHub's engineering blog on how they migrated from Memcached to sharded Redis for API rate limiting—**real numbers from production.**
- Halodoc's blog on their rate limiter—another real-world case study with specific latency numbers.
- arXiv:2602.11741 — if you want the academic treatment of distributed rate limiting algorithms.

**Before publishing:** spot-check that these links are live. A dead reference on a resource page kills credibility instantly.

## 13. Conclusions and Next Steps

You've got a blueprint for building a real distributed system. Not a tutorial project, not a library wrapper—a system that makes decisions under load, adapts to changing conditions, and gives you concrete data to defend those decisions.

By the time you finish, you'll have experience with Redis atomicity, gateway patterns, PostgreSQL caching, OpenTelemetry instrumentation, Docker composition, and load testing. **That's a portfolio piece that interviewers want to dig into.** The trade-offs you documented, the metrics you captured, the edge cases you handled—those are what separate "I followed a tutorial" from "I built a system."

### Next Steps to Level Up

- **API key management:** add HMAC-signed requests and key rotation via the dashboard.
- **Multi-region sync:** replicate rate-limit state across data centers with Redis cluster.
- **Anomaly detection:** flag unusual traffic patterns—maybe a client suddenly went from 100 req/s to 50k.
- **Cost modeling:** show users how much they're paying per request and suggest optimization.

Each extension teaches something new and gives you more talking points in interviews.

### Final Thought

The value of this project isn't in the finished product—it's in the decisions. Why Redis Lua and not transactions? Why sliding-window-counter and not token-bucket? Why fail-open and not fail-closed? **Every answer is a conversation**, not a decree. That's what separates a strong engineer from someone who just picks the first option.

Build this, own the trade-offs, document the hell out of it. That's how projects become portfolio pieces.
