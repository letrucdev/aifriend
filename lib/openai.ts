import OpenAI from "openai"

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn(
    "[openai] OPENAI_API_KEY is not set. OpenAI fallback will be unavailable."
  )
}

export const openai = apiKey ? new OpenAI({ apiKey }) : null
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini"
