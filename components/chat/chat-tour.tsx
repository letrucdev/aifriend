"use client"

import * as React from "react"
import { Joyride, type EventData, type Step } from "react-joyride"
import { HelpCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const TOUR_STORAGE_KEY = "may.tour.completed.v1"

function getSteps(isEmpty: boolean): Step[] {
  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      title: "Chào cậu, mình là Mây 🌸",
      content:
        "Để Mây dắt cậu đi một vòng làm quen tí ti nha~ Có gì cứ bấm Tiếp để mình kể tiếp nhé 💛",
      skipBeacon: true,
    },
  ]

  if (isEmpty) {
    steps.push({
      target: '[data-tour="suggestions"]',
      title: "Chưa biết mở lời hả? 🌷",
      content:
        "Cậu cứ bấm thử một gợi ý ở đây cũng được, Mây sẽ lắng nghe và đáp lại liền nè~",
      skipBeacon: true,
    })
  }

  steps.push(
    {
      target: '[data-tour="chat-input"]',
      title: "Tâm sự ở đây nha 💌",
      content:
        "Gõ bất cứ điều gì đang lởn vởn trong đầu cậu. Nhấn Enter để gửi, Shift cộng Enter để xuống dòng, nhẹ nhàng thoai~",
      skipBeacon: true,
    },
    {
      target: '[data-tour="sidebar-trigger"]',
      title: "Sổ tay trò chuyện 📚",
      content:
        "Bấm vô đây để mở danh sách những lần mình tâm sự nè. Tất cả chỉ lưu ở máy của cậu thôi, không ai khác đọc được đâu 🤍",
      skipBeacon: true,
    },
    {
      target: '[data-tour="feedback"]',
      title: "Có gì muốn nhắn Mây không? 💛",
      content:
        "Nếu Mây có chỗ nào chưa hiểu cậu, hoặc cậu muốn Mây dễ thương hơn nữa, bấm vô đây nói nhỏ với Mây nghen~",
      skipBeacon: true,
    },
    {
      target: "body",
      placement: "center",
      title: "Vậy là xong vòng làm quen rồi nè 🌸",
      content:
        "Mây luôn ở đây, cứ kể Mây nghe khi cậu cần, không cần khách sáo gì hết á 🤍",
      skipBeacon: true,
    },
  )

  return steps
}

export function ChatTour({ isEmpty }: { isEmpty: boolean }) {
  const [run, setRun] = React.useState(false)
  const steps = React.useMemo(() => getSteps(isEmpty), [isEmpty])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (window.localStorage.getItem(TOUR_STORAGE_KEY)) return
    const t = window.setTimeout(() => setRun(true), 700)
    return () => window.clearTimeout(t)
  }, [])

  const startTour = () => {
    setRun(false)
    window.setTimeout(() => setRun(true), 50)
  }

  const finishTour = React.useCallback(() => {
    setRun(false)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOUR_STORAGE_KEY, "1")
    }
  }, [])

  const handleEvent = (data: EventData) => {
    if (data.status === "finished" || data.status === "skipped") {
      finishTour()
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={startTour}
        className="text-muted-foreground hover:text-foreground shrink-0 gap-1.5"
        aria-label="Xem hướng dẫn dùng Mây"
      >
        <HelpCircleIcon className="size-4" />
        <span className="hidden sm:inline">Hướng dẫn</span>
      </Button>
      <Joyride
        steps={steps}
        run={run}
        continuous
        scrollToFirstStep
        onEvent={handleEvent}
        options={{
          showProgress: true,
          skipBeacon: true,
          overlayClickAction: false,
          buttons: ["back", "skip", "primary"],
          primaryColor: "#ec4899",
          arrowColor: "#ffffff",
          backgroundColor: "#ffffff",
          textColor: "#0f172a",
          overlayColor: "rgba(15, 23, 42, 0.45)",
          zIndex: 10000,
          spotlightRadius: 14,
        }}
        styles={{
          tooltip: {
            borderRadius: 20,
            padding: 22,
            boxShadow:
              "0 24px 60px -20px rgba(236, 72, 153, 0.35), 0 8px 24px rgba(15, 23, 42, 0.08)",
          },
          tooltipContainer: { textAlign: "left" },
          tooltipTitle: {
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 6,
            letterSpacing: "-0.01em",
          },
          tooltipContent: {
            fontSize: 14,
            lineHeight: 1.65,
            padding: 0,
            color: "#334155",
            marginBottom: 12
          },
          buttonPrimary: {
            borderRadius: 12,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 500,
          },
          buttonBack: { color: "#64748b", marginRight: 8, fontSize: 13 },
          buttonSkip: { color: "#94a3b8", fontSize: 13 },
        }}
        locale={{
          back: "Quay lại",
          close: "Đóng",
          last: "Mây hiểu rồi 💛",
          next: "Tiếp nè",
          nextWithProgress: "Tiếp nè ({current}/{total})",
          open: "Mở hướng dẫn",
          skip: "Bỏ qua nha",
        }}
      />
    </>
  )
}
