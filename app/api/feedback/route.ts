import { NextRequest, NextResponse } from "next/server"

import { checkRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_NAME = 80
const MAX_EMAIL = 120
const MAX_COMMENT = 1000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FeedbackPayload = {
  rating?: unknown
  name?: unknown
  email?: unknown
  comment?: unknown
  conversationId?: unknown
  messageCount?: unknown
}

function getClientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]?.trim() ?? "unknown"
  return req.headers.get("x-real-ip") ?? "unknown"
}

function asString(v: unknown, max: number): string {
  if (typeof v !== "string") return ""
  return v.slice(0, max).trim()
}

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req)
  const limit = await checkRateLimit(`feedback:${clientKey}`)
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "Cậu gửi hơi nhanh rồi 🥺 Đợi chút nha.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    )
  }

  let payload: FeedbackPayload
  try {
    payload = (await req.json()) as FeedbackPayload
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Yêu cầu không hợp lệ." },
      { status: 400 }
    )
  }

  const ratingNum = Number(payload.rating)
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json(
      { error: "invalid_rating", message: "Cậu chọn từ 1 đến 5 sao nhé." },
      { status: 400 }
    )
  }

  const name = asString(payload.name, MAX_NAME)
  const email = asString(payload.email, MAX_EMAIL)
  const comment = asString(payload.comment, MAX_COMMENT)
  const conversationId = asString(payload.conversationId, 64)
  const messageCount =
    typeof payload.messageCount === "number" &&
    Number.isFinite(payload.messageCount)
      ? payload.messageCount
      : null

  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "invalid_email", message: "Email không hợp lệ." },
      { status: 400 }
    )
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  const record = {
    timestamp: new Date().toISOString(),
    rating: ratingNum,
    name,
    email,
    comment,
    conversationId,
    messageCount,
    userAgent: req.headers.get("user-agent") ?? "",
    ip: clientKey,
  }

  if (!webhookUrl) {
    console.warn(
      "[/api/feedback] GOOGLE_SHEETS_WEBHOOK_URL chưa cấu hình. Đánh giá:",
      record
    )
    return NextResponse.json({ ok: true, stored: false })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: controller.signal,
      redirect: "follow",
    })
    clearTimeout(timeout)
    if (!res.ok) {
      console.error(
        "[/api/feedback] webhook trả về lỗi",
        res.status,
        await res.text().catch(() => "")
      )
      return NextResponse.json(
        {
          error: "webhook_failed",
          message: "Mây ghi nhận chưa được, cậu thử lại sau nha 🥺",
        },
        { status: 502 }
      )
    }
  } catch (err) {
    console.error("[/api/feedback] webhook error", err)
    return NextResponse.json(
      {
        error: "webhook_error",
        message: "Mây ghi nhận chưa được, cậu thử lại sau nha 🥺",
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true, stored: true })
}
