"use client"

import * as React from "react"
import { MessageSquareHeart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatTour } from "@/components/chat/chat-tour"
import { EmptyState } from "@/components/chat/empty-state"
import { RatingDialog } from "@/components/chat/rating-dialog"
import { useChat } from "@/hooks/use-chat"
import { useConversations } from "@/hooks/use-conversations"

export function ChatPanel() {
  const {
    messages,
    isStreaming,
    send,
    stop,
    ratingPrompt,
    closeRatingPrompt,
    openFeedback,
    startNewConversation,
  } = useChat()
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
        <SidebarTrigger data-tour="sidebar-trigger" />
        <Separator orientation="vertical" className="h-full" />
        <div className="min-w-0 flex-1 truncate text-sm font-medium tracking-[-0.01em]">
          {currentConversation?.title ?? "Chào cậu 🌸"}
        </div>
        <ChatTour isEmpty={isEmpty} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openFeedback}
          data-tour="feedback"
          className="text-muted-foreground hover:text-foreground -mr-1 shrink-0 gap-1.5"
          aria-label="Gửi feedback cho Mây"
        >
          <MessageSquareHeart className="size-4" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
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
        <div data-tour="chat-input" className="mx-auto w-full max-w-3xl">
          <ChatInput onSend={send} onStop={stop} isStreaming={isStreaming} />
        </div>
      </div>

      <RatingDialog
        open={ratingPrompt !== null}
        onOpenChange={(open) => {
          if (!open) closeRatingPrompt()
        }}
        conversationId={ratingPrompt?.conversationId ?? null}
        messageCount={ratingPrompt?.messageCount}
        reason={ratingPrompt?.reason}
        onStartNew={() => {
          closeRatingPrompt()
          startNewConversation()
        }}
      />
    </div>
  )
}
