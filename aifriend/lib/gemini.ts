import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn(
    "[gemini] GEMINI_API_KEY is not set. /api/chat will fail until you add it to .env.local."
  )
}

export const genAI = new GoogleGenAI({ apiKey: apiKey ?? "" })
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash"
