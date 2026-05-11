"use client"

import * as React from "react"
import { toast } from "sonner"

import { useConversations, type ChatMessage } from "@/hooks/use-conversations"

const MAX_HISTORY = 19
const FEEDBACK_MILESTONE = 10
const FEEDBACK_SHOWN_KEY = "aifriend:feedback-shown:v1"

export type SendOptions = {
  ensureConversationId?: () => string
}

export type RatingPromptReason = "milestone" | "manual" | "limit"

export type RatingPrompt = {
  conversationId: string | null
  messageCount: number
  reason: RatingPromptReason
}

function hasShownAutoFeedback(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(FEEDBACK_SHOWN_KEY) === "1"
}

function markAutoFeedbackShown() {
  if (typeof window === "undefined") return
  window.localStorage.setItem(FEEDBACK_SHOWN_KEY, "1")
}

export function useChat() {
  const {
    currentId,
    currentConversation,
    appendMessage,
    updateMessage,
    createConversation,
  } = useConversations()

  const [isStreaming, setIsStreaming] = React.useState(false)
  const [ratingPrompt, setRatingPrompt] =
    React.useState<RatingPrompt | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  const closeRatingPrompt = React.useCallback(() => {
    setRatingPrompt(null)
  }, [])

  const messages: ChatMessage[] = currentConversation?.messages ?? []
  const messageCount = messages.length

  const openFeedback = React.useCallback(() => {
    setRatingPrompt({
      conversationId: currentId ?? null,
      messageCount,
      reason: "manual",
    })
  }, [currentId, messageCount])

  const stop = React.useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsStreaming(false)
  }, [])

  const send = React.useCallback(
    async (content: string) => {
      const text = content.trim()
      if (!text || isStreaming) return

      let conversationId = currentId
      if (!conversationId) {
        conversationId = createConversation()
      }

      // Build the prior messages (before adding the new user message)
      const prior = currentConversation?.messages ?? []
      const trimmed = prior.slice(-MAX_HISTORY).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      // 1. Append user message optimistically
      appendMessage(conversationId, { role: "user", content: text })

      // 2. Append empty assistant placeholder
      const assistantId = appendMessage(conversationId, {
        role: "assistant",
        content: "",
      })

      const controller = new AbortController()
      abortRef.current = controller
      setIsStreaming(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...trimmed, { role: "user", content: text }],
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          let message = "Có chuyện gì đó xảy ra rồi 🥺 Cậu thử lại sau nha."
          try {
            const data = (await response.json()) as {
              message?: string
              error?: string
            }
            if (data.message) message = data.message
          } catch {
            /* swallow */
          }
          updateMessage(conversationId, assistantId, message)
          if (response.status === 429) {
            toast.warning(message)
          } else {
            toast.error(message)
          }
          return
        }

        const reader = response.body?.getReader()
        if (!reader) {
          updateMessage(conversationId, assistantId, "Mây đang nghẹn lời… 🥺")
          return
        }

        const decoder = new TextDecoder()
        let acc = ""
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          acc += decoder.decode(value, { stream: true })
          updateMessage(conversationId, assistantId, acc)
        }
        acc += decoder.decode()
        updateMessage(conversationId, assistantId, acc)

        // After a successful exchange, check if we've crossed the feedback
        // milestone. Trigger the dialog once per device.
        const newCount = prior.length + 2
        if (newCount >= FEEDBACK_MILESTONE && !hasShownAutoFeedback()) {
          markAutoFeedbackShown()
          setRatingPrompt({
            conversationId,
            messageCount: newCount,
            reason: "milestone",
          })
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // Keep what was streamed so far; no toast.
          return
        }
        console.error(err)
        updateMessage(
          conversationId,
          assistantId,
          "Mạng có vẻ chập chờn rồi cậu ơi 🥺 Cậu thử lại nhé."
        )
        toast.error("Không kết nối được. Cậu thử lại sau nha 🥺")
      } finally {
        abortRef.current = null
        setIsStreaming(false)
      }
    },
    [
      appendMessage,
      createConversation,
      currentConversation?.messages,
      currentId,
      isStreaming,
      updateMessage,
    ]
  )

  return {
    messages,
    isStreaming,
    send,
    stop,
    conversationId: currentId,
    ratingPrompt,
    closeRatingPrompt,
    openFeedback,
    startNewConversation: createConversation,
  }
}
