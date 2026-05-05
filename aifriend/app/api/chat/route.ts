import { HarmBlockThreshold, HarmCategory } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

import { GEMINI_MODEL, genAI } from "@/lib/gemini"
import { filterPrompt } from "@/lib/prompt-filter"
import { checkRateLimit } from "@/lib/rate-limit"
import { SYSTEM_PROMPT } from "@/lib/system-prompt"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type IncomingMessage = {
  role: "user" | "assistant"
  content: string
}

const MAX_MESSAGES = 20
const MAX_CONTENT_LENGTH = 4000

function getClientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]?.trim() ?? "unknown"
  return req.headers.get("x-real-ip") ?? "unknown"
}

function streamFromText(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      // Stream char-by-char in small chunks for a natural typing feel.
      const chunkSize = 3
      const delayMs = 18
      for (let i = 0; i < text.length; i += chunkSize) {
        controller.enqueue(encoder.encode(text.slice(i, i + chunkSize)))
        await new Promise((r) => setTimeout(r, delayMs))
      }
      controller.close()
    },
  })
}

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req)

  const limit = checkRateLimit(clientKey)
  if (!limit.ok) {
    const message =
      limit.scope === "minute"
        ? "Cậu nhắn hơi nhanh rồi 🥺 Đợi một chút rồi nhắn tiếp nha (~" +
          limit.retryAfter +
          "s)."
        : "Hôm nay mình tâm sự cũng nhiều rồi đó 🌷 Mai cậu quay lại với Mây nhé."
    return NextResponse.json(
      { error: "rate_limited", scope: limit.scope, message },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      }
    )
  }

  let payload: { messages?: IncomingMessage[] }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Yêu cầu không hợp lệ." },
      { status: 400 }
    )
  }

  const messages = payload.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "no_messages", message: "Cậu chưa gửi gì cả 🌷" },
      { status: 400 }
    )
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json(
      { error: "too_many_messages", message: "Cuộc trò chuyện hơi dài rồi 🥺" },
      { status: 400 }
    )
  }
  for (const m of messages) {
    if (
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > MAX_CONTENT_LENGTH
    ) {
      return NextResponse.json(
        { error: "invalid_message", message: "Tin nhắn không hợp lệ." },
        { status: 400 }
      )
    }
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user")
  if (!lastUser) {
    return NextResponse.json(
      { error: "no_user_message", message: "Chưa thấy lời nhắn của cậu 🌷" },
      { status: 400 }
    )
  }

  // Filter off-topic prompts
  const filterResult = filterPrompt(lastUser.content)
  if (filterResult.blocked) {
    return new Response(streamFromText(filterResult.reply), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error: "no_api_key",
        message:
          "Mây chưa được kết nối đâu 🥺.",
      },
      { status: 500 }
    )
  }

  // Map to Gemini contents format
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await genAI.models.generateContentStream({
          model: GEMINI_MODEL,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 1024,
            safetySettings: [
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
              },
              {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
              },
              {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
            ],
          },
        })
        let any = false
        for await (const chunk of response) {
          const text = chunk.text
          if (text) {
            any = true
            controller.enqueue(encoder.encode(text))
          }
        }
        if (!any) {
          controller.enqueue(
            encoder.encode(
              "Mây hơi ngại nói chuyện này quá 🥺 Cậu kể cho mình nghe chuyện khác trong lòng cậu được không?"
            )
          )
        }
      } catch (err) {
        console.error("[/api/chat] gemini error", err)
        controller.enqueue(
          encoder.encode(
            "Có chuyện gì đó xảy ra với Mây rồi 🥺 Cậu thử nhắn lại sau một chút nha."
          )
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
