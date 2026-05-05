/* eslint-disable react-hooks/set-state-in-effect */
import * as React from "react"

import { cn } from "@/lib/utils"
import { type ChatMessage as ChatMessageType } from "@/hooks/use-conversations"

function renderContent(content: string) {
  if (!content) return null
  const paragraphs = content.split(/\n{2,}/)
  return paragraphs.map((para, i) => (
    <p key={i} className="whitespace-pre-wrap">
      {para}
    </p>
  ))
}

// Reveals `target` progressively. New mounts snap to full content (so historical
// messages don't re-type when switching conversations); only growth animates.
function useTypewriter(target: string) {
  const [displayed, setDisplayed] = React.useState(target)

  React.useEffect(() => {
    if (displayed === target) return
    if (!target.startsWith(displayed)) {
      setDisplayed(target)
      return
    }
    const remaining = target.length - displayed.length
    const chunk = Math.max(1, Math.ceil(remaining / 24))
    const id = window.setTimeout(() => {
      setDisplayed(target.slice(0, displayed.length + chunk))
    }, 28)
    return () => window.clearTimeout(id)
  }, [displayed, target])

  return displayed
}

export function ChatMessage({
  message,
  isStreaming,
}: {
  message: ChatMessageType
  isStreaming?: boolean
}) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="bg-secondary text-secondary-foreground max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed tracking-[-0.01em]">
          {renderContent(message.content)}
        </div>
      </div>
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const displayed = useTypewriter(message.content)
  const showCursor = isStreaming && !displayed
  return (
    <div className="flex w-full gap-3">
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-base"
        style={{
          background:
            "linear-gradient(135deg, #fbcfe8 0%, #c4b5fd 50%, #bae6fd 100%)",
        }}
        aria-hidden
      >
        🌷
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-muted-foreground font-mono text-[11px] tracking-[0.08em] uppercase">
          Mây
        </span>
        <div
          className={cn(
            "text-foreground space-y-3 text-[15px] leading-relaxed tracking-[-0.01em]"
          )}
        >
          {showCursor ? (
            <span className="text-muted-foreground inline-flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-current" />
              <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:120ms]" />
              <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:240ms]" />
            </span>
          ) : (
            renderContent(displayed)
          )}
        </div>
      </div>
    </div>
  )
}
