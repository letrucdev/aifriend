"use client"

import Image from "next/image"

const SUGGESTIONS = [
  "Hôm nay mình hơi mệt, không biết bắt đầu từ đâu…",
  "Mình đang cô đơn quá, tâm sự với cậu được không?",
  "Mình vừa cãi nhau với người thân, buồn ghê.",
  "Bạn ơi, dạo này mình mất ngủ liên miên.",
]

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[55%] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, #fbcfe8 0%, #c4b5fd 45%, transparent 70%), radial-gradient(40% 40% at 80% 30%, #bae6fd 0%, transparent 60%)",
        }}
      />
      <div className="relative mb-6 w-fit">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-[border-grow_2.6s_ease-in-out_infinite] rounded-3xl ring-2 ring-pink-300/70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-[border-grow_2.6s_ease-in-out_infinite] rounded-3xl ring-2 ring-purple-300/60 [animation-delay:-1.3s]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-0.75 animate-[border-spin_6s_linear_infinite] rounded-[calc(var(--radius-3xl)+3px)]"
          style={{
            background:
              "conic-gradient(from var(--border-angle) at 50% 50%, transparent 0deg 200deg, rgba(244,114,182,0.3) 230deg, rgba(244,114,182,0.9) 270deg, rgba(192,132,252,0.9) 310deg, rgba(192,132,252,0.3) 340deg, transparent 360deg)",
          }}
        />
        <div className="relative overflow-hidden rounded-3xl shadow-[0_8px_24px_rgba(1,1,32,0.12)] ring-1 ring-pink-200/60">
          {/* <Image
            src="/PinkPearl.jpg"
            alt="Mây — bạn lắng nghe cậu"
            width={837}
            height={960}
            priority
            className="h-44 w-auto object-cover sm:h-56"
          /> */}
          <div
            className="flex size-40 items-center justify-center rounded-md text-6xl"
            style={{
              background:
                "linear-gradient(135deg, #fbcfe8 0%, #c4b5fd 50%, #bae6fd 100%)",
            }}
            aria-hidden
          >
            <span className="animate-pulse">🌸</span>
          </div>
        </div>
      </div>
      <p className="mb-3 text-muted-foreground">
        Mây · người bạn lắng nghe cậu
      </p>
      <h1 className="max-w-xl text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
        Mình ở đây nè, kể mình nghe đi 🌷
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed tracking-[-0.01em] text-muted-foreground">
        Mây không phải chuyên gia, mình chỉ là một người bạn nhỏ luôn sẵn sàng
        lắng nghe và đồng hành cùng cậu thôi 💛
      </p>

      <div
        data-tour="suggestions"
        className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2"
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-card px-4 py-3 text-left text-[14px] leading-relaxed tracking-[-0.01em] text-foreground transition hover:bg-accent"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
