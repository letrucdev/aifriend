import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible"

const PER_MINUTE = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 10)
const PER_DAY = Number(process.env.RATE_LIMIT_PER_DAY ?? 100)

declare global {
  var __aifriend_rate_limit_minute__: RateLimiterMemory | undefined
  var __aifriend_rate_limit_day__: RateLimiterMemory | undefined
}

// Reuse limiters across HMR reloads in dev so counters don't reset on every edit.
const minuteLimiter =
  globalThis.__aifriend_rate_limit_minute__ ??
  new RateLimiterMemory({
    keyPrefix: "aifriend:min",
    points: PER_MINUTE,
    duration: 60,
  })
globalThis.__aifriend_rate_limit_minute__ = minuteLimiter

const dayLimiter =
  globalThis.__aifriend_rate_limit_day__ ??
  new RateLimiterMemory({
    keyPrefix: "aifriend:day",
    points: PER_DAY,
    duration: 24 * 60 * 60,
  })
globalThis.__aifriend_rate_limit_day__ = dayLimiter

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfter: number; scope: "minute" | "day" }

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  try {
    await minuteLimiter.consume(key)
  } catch (rej) {
    const res = rej as RateLimiterRes
    return {
      ok: false,
      retryAfter: Math.ceil(res.msBeforeNext / 1000),
      scope: "minute",
    }
  }

  try {
    await dayLimiter.consume(key)
  } catch (rej) {
    const res = rej as RateLimiterRes
    return {
      ok: false,
      retryAfter: Math.ceil(res.msBeforeNext / 1000),
      scope: "day",
    }
  }

  return { ok: true }
}
