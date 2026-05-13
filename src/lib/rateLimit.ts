/**
 * Lightweight in-memory rate limiter for Edge/Node API routes.
 * Uses a sliding-window counter keyed by IP + route.
 *
 * Works without any external dependency — good enough for Vercel's
 * serverless/edge functions where each instance handles one request at a time.
 * For multi-region production use, swap the Map for Upstash Redis.
 */

const counts = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  /** Max requests allowed in the window. Default: 10 */
  limit?: number;
  /** Window duration in milliseconds. Default: 60_000 (1 min) */
  windowMs?: number;
}

export function rateLimit(
  ip: string,
  route: string,
  { limit = 10, windowMs = 60_000 }: RateLimitOptions = {}
): { allowed: boolean; remaining: number } {
  const key = `${ip}:${route}`;
  const now = Date.now();

  const entry = counts.get(key);

  if (!entry || now > entry.resetAt) {
    counts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return { allowed: entry.count <= limit, remaining };
}
