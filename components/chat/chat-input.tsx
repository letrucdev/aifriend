"use client"

import * as React from "react"
import { SendIcon, SquareIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const MAX_LENGTH = 4000

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  className,
}: {
  onSend: (text: string) => void
  onStop?: () => void
  isStreaming?: boolean
  className?: string
}) {
  const [value, setValue] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  const submit = () => {
    const text = value.trim()
    if (!text || isStreaming) return
    onSend(text)
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  const remaining = MAX_LENGTH - value.length

  return (
    <div className={cn("relative w-full", className)}>
      <div className="border-border bg-card focus-within:ring-ring/30 flex items-end gap-2 rounded-2xl border p-2 shadow-sm transition focus-within:ring-3">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Tâm sự với Mây nha…"
          rows={1}
          className="max-h-[200px] min-h-[24px] resize-none border-0 bg-transparent p-2 text-[15px] leading-relaxed tracking-[-0.01em] shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        {isStreaming ? (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={onStop}
            aria-label="Dừng phản hồi"
          >
            <SquareIcon className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="icon"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Gửi tin nhắn"
          >
            <SendIcon className="size-4" />
          </Button>
        )}
      </div>
      <div className="text-muted-foreground mt-1.5 flex items-center justify-between px-1 text-[11px]">
        <span>Enter để gửi · Shift + Enter xuống dòng</span>
        {remaining < 200 && (
          <span className={cn(remaining < 50 && "text-destructive")}>
            Còn {remaining} ký tự
          </span>
        )}
      </div>
    </div>
  )
}
