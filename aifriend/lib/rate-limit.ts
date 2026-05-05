const PER_MINUTE = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 10)
const PER_DAY = Number(process.env.RATE_LIMIT_PER_DAY ?? 100)

const MINUTE_MS = 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

type Bucket = {
  minute: number[]
  day: number[]
}

declare global {
  var __aifriend_rate_limit__: Map<string, Bucket> | undefined
  var __aifriend_rate_limit_cleanup__: NodeJS.Timeout | undefined
}

const store: Map<string, Bucket> =
  globalThis.__aifriend_rate_limit__ ?? new Map()
globalThis.__aifriend_rate_limit__ = store

if (!globalThis.__aifriend_rate_limit_cleanup__) {
  globalThis.__aifriend_rate_limit_cleanup__ = setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of store) {
      bucket.minute = bucket.minute.filter((t) => now - t < MINUTE_MS)
      bucket.day = bucket.day.filter((t) => now - t < DAY_MS)
      if (bucket.minute.length === 0 && bucket.day.length === 0) {
        store.delete(key)
      }
    }
  }, MINUTE_MS)
  // Allow process to exit naturally in dev/test
  globalThis.__aifriend_rate_limit_cleanup__.unref?.()
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfter: number; scope: "minute" | "day" }

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now()
  const bucket = store.get(key) ?? { minute: [], day: [] }

  bucket.minute = bucket.minute.filter((t) => now - t < MINUTE_MS)
  bucket.day = bucket.day.filter((t) => now - t < DAY_MS)

  if (bucket.day.length >= PER_DAY) {
    const retryAfter = Math.ceil(
      (DAY_MS - (now - bucket.day[0]!)) / 1000
    )
    store.set(key, bucket)
    return { ok: false, retryAfter, scope: "day" }
  }

  if (bucket.minute.length >= PER_MINUTE) {
    const retryAfter = Math.ceil(
      (MINUTE_MS - (now - bucket.minute[0]!)) / 1000
    )
    store.set(key, bucket)
    return { ok: false, retryAfter, scope: "minute" }
  }

  bucket.minute.push(now)
  bucket.day.push(now)
  store.set(key, bucket)
  return { ok: true }
}
