"use client"

import * as React from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessage } from "@/components/chat/chat-message"
import { EmptyState } from "@/components/chat/empty-state"
import { useChat } from "@/hooks/use-chat"
import { useConversations } from "@/hooks/use-conversations"

export function ChatPanel() {
  const { messages, isStreaming, send, stop } = useChat()
  const { currentConversation } = useConversations()
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, isStreaming])

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-svh min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-full" />
        <div className="min-w-0 flex-1 truncate text-sm font-medium tracking-[-0.01em]">
          {currentConversation?.title ?? "Chào cậu 🌸"}
        </div>
      </header>

      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyState onPick={(t) => send(t)} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
            {messages.map((m, i) => (
              <ChatMessage
                key={m.id}
                message={m}
                isStreaming={
                  isStreaming &&
                  i === messages.length - 1 &&
                  m.role === "assistant"
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t bg-background/80 shrink-0 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput onSend={send} onStop={stop} isStreaming={isStreaming} />
        </div>
      </div>
    </div>
  )
}
