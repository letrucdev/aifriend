"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type RatingDialogReason = "milestone" | "manual" | "limit"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversationId?: string | null
  messageCount?: number
  reason?: RatingDialogReason
  onStartNew?: () => void
}

const STAR_LABELS: Record<number, string> = {
  1: "Mây làm cậu chưa hài lòng 🥺",
  2: "Mây cần cố gắng thêm",
  3: "Mây ổn ổn nha",
  4: "Mây dễ thương đó!",
  5: "Mây tuyệt vời quá 💛",
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COPY: Record<
  RatingDialogReason,
  { title: string; description: string; dismissLabel: string }
> = {
  milestone: {
    title: "Cậu thấy Mây thế nào? 🌷",
    description:
      "Cậu đã tâm sự với Mây được một lúc rồi. Cậu để lại vài dòng cho Mây cải thiện nha?",
    dismissLabel: "Để sau",
  },
  manual: {
    title: "Gửi feedback cho Mây 💌",
    description:
      "Cậu thấy Mây thế nào? Mây luôn muốn lắng nghe để dễ thương hơn với cậu.",
    dismissLabel: "Đóng",
  },
  limit: {
    title: "Cậu thấy Mây thế nào? 🌷",
    description:
      "Cuộc trò chuyện này hơi dài rồi, để Mây mở phiên mới nha. Cậu để lại vài dòng cho Mây cải thiện được không?",
    dismissLabel: "Bỏ qua, mở phiên mới",
  },
}

export function RatingDialog({
  open,
  onOpenChange,
  conversationId,
  messageCount,
  reason = "milestone",
  onStartNew,
}: Props) {
  const copy = COPY[reason]
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        {open && (
          <RatingForm
            key={conversationId ?? "anon"}
            conversationId={conversationId ?? null}
            messageCount={messageCount}
            dismissLabel={copy.dismissLabel}
            onClose={() => onOpenChange(false)}
            onStartNew={reason === "limit" ? onStartNew : undefined}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

type FormProps = {
  conversationId: string | null
  messageCount?: number
  dismissLabel: string
  onClose: () => void
  onStartNew?: () => void
}

function RatingForm({
  conversationId,
  messageCount,
  dismissLabel,
  onClose,
  onStartNew,
}: FormProps) {
  const [rating, setRating] = React.useState(0)
  const [hover, setHover] = React.useState(0)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [comment, setComment] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [emailError, setEmailError] = React.useState<string | null>(null)

  const display = hover || rating
  const helperLabel =
    display > 0 ? STAR_LABELS[display] : "Chọn số sao cậu muốn dành cho Mây"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (rating < 1) {
      toast.warning("Cậu chọn ít nhất 1 sao cho Mây nhé 🌷")
      return
    }
    if (email && !EMAIL_RE.test(email.trim())) {
      setEmailError("Email không hợp lệ")
      return
    }
    setEmailError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          name: name.trim(),
          email: email.trim(),
          comment: comment.trim(),
          conversationId,
          messageCount: messageCount ?? null,
        }),
      })
      if (!res.ok) {
        let msg = "Gửi đánh giá chưa được, cậu thử lại sau nha 🥺"
        try {
          const data = (await res.json()) as { message?: string }
          if (data.message) msg = data.message
        } catch {
          /* ignore */
        }
        toast.error(msg)
        return
      }
      toast.success("Cảm ơn cậu đã đánh giá Mây 💛")
      if (onStartNew) {
        onStartNew()
      } else {
        onClose()
      }
    } catch {
      toast.error("Mạng có vẻ chập chờn, cậu thử lại nha 🥺")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex items-center gap-1"
          role="radiogroup"
          aria-label="Đánh giá Mây từ 1 đến 5 sao"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover || rating) >= n
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} sao`}
                onMouseEnter={() => setHover(n)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(0)}
                onClick={() => setRating(n)}
                className="rounded-full p-1 outline-none transition focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <Star
                  className={cn(
                    "size-8 transition",
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-muted-foreground/40"
                  )}
                />
              </button>
            )
          })}
        </div>
        <p
          className={cn(
            "text-xs",
            display > 0 ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {helperLabel}
        </p>
      </div>

      <div className="grid gap-3">
        <div className="grid gap-1.5">
          <label
            htmlFor="rating-name"
            className="text-xs font-medium text-muted-foreground"
          >
            Tên (tuỳ chọn)
          </label>
          <Input
            id="rating-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cậu tên gì nè?"
            maxLength={80}
            autoComplete="name"
          />
        </div>
        <div className="grid gap-1.5">
          <label
            htmlFor="rating-email"
            className="text-xs font-medium text-muted-foreground"
          >
            Email (tuỳ chọn)
          </label>
          <Input
            id="rating-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError(null)
            }}
            placeholder="banthan@email.com"
            maxLength={120}
            autoComplete="email"
            aria-invalid={emailError ? true : undefined}
          />
          {emailError && (
            <p className="text-xs text-destructive">{emailError}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <label
            htmlFor="rating-comment"
            className="text-xs font-medium text-muted-foreground"
          >
            Nhận xét cho Mây
          </label>
          <Textarea
            id="rating-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Mây có gì cậu thích, có gì cần cải thiện?"
            maxLength={1000}
            rows={4}
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={() => (onStartNew ? onStartNew() : onClose())}
          disabled={submitting}
        >
          {dismissLabel}
        </Button>
        <Button type="submit" disabled={submitting || rating < 1}>
          {submitting ? "Đang gửi…" : "Gửi đánh giá"}
        </Button>
      </DialogFooter>
    </form>
  )
}
