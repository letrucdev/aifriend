import { MonoLabel } from "@/components/chat/mono-label"

export function MaySection() {
  return (
    <section
      className="relative overflow-hidden border-y border-black/6"
      style={{
        background:
          "radial-gradient(55% 60% at 18% 30%, #fde0ee 0%, transparent 65%), radial-gradient(50% 55% at 82% 70%, #d8c4ff 0%, transparent 65%), radial-gradient(45% 60% at 50% 100%, #c8e8ff 0%, transparent 70%), #fff8fb",
      }}
    >
      <div className="relative mx-auto grid w-full max-w-300 gap-10 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-12">
        <div className="relative z-10">
          <p className="text-black/60">✱ &nbsp; Người bạn tâm giao</p>

          <h2
            className="mt-4 leading-[0.95] font-medium tracking-tighter text-black"
            style={{ fontSize: "clamp(96px, 16vw, 200px)" }}
          >
            mây
          </h2>

          <p
            className="mt-12 text-black/70 italic"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(20px, 2.4vw, 28px)",
            }}
          >
            trôi cùng mây nhé, đừng mãi suy tư
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-black/8 bg-white/80 px-3 py-1.5 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-[#ef2cc1]" />
            <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-black/70 uppercase">
              v0.1 · luôn lắng nghe
            </span>
          </div>
        </div>

        <div className="relative h-80 sm:h-100 md:h-110">
          <span
            aria-hidden
            className="absolute top-[8%] right-[12%] size-44 rounded-full bg-[#bdbbff] blur-[2px] sm:size-56 md:size-64"
            style={{
              boxShadow:
                "inset -20px -30px 60px rgba(255,255,255,0.35), inset 20px 30px 60px rgba(60,40,140,0.18), 0 30px 60px rgba(124,135,255,0.35)",
            }}
          />
          <span
            aria-hidden
            className="absolute top-[28%] right-[40%] size-28 rounded-full bg-[#d8d6ff] blur-[2px] sm:size-36 md:size-40"
            style={{
              boxShadow:
                "inset -15px -20px 40px rgba(255,255,255,0.5), inset 12px 18px 40px rgba(80,60,160,0.12), 0 20px 40px rgba(180,160,255,0.3)",
            }}
          />
          <span
            aria-hidden
            className="absolute top-[55%] right-[8%] size-20 rounded-full bg-[#c4bfff] blur-[2px] sm:size-24 md:size-28"
            style={{
              boxShadow:
                "inset -10px -15px 30px rgba(255,255,255,0.4), inset 10px 15px 30px rgba(70,50,140,0.15), 0 15px 30px rgba(160,140,255,0.3)",
            }}
          />

          <Star
            className="absolute top-[12%] right-[55%] size-10 sm:size-12"
            color="#ffd95c"
          />
          <Star
            className="absolute top-[34%] right-[18%] size-12 sm:size-14"
            color="#fbbcd9"
          />
          <Star
            className="absolute top-[58%] right-[45%] size-9 sm:size-11"
            color="#ffe06a"
          />
          <Star
            className="absolute top-[18%] right-[5%] size-7 sm:size-8"
            color="#ffd95c"
          />

          <span
            aria-hidden
            className="absolute top-[6%] right-[2%] inline-flex size-12 items-center justify-center rounded-[50%_50%_50%_8px] bg-white text-[20px] sm:size-14 sm:text-[24px]"
            style={{
              boxShadow: "0 4px 10px rgba(1, 1, 32, 0.1)",
            }}
          >
            ❤️
          </span>
        </div>
      </div>
    </section>
  )
}

function Star({ className, color }: { className?: string; color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      style={{
        filter: `drop-shadow(0 4px 8px ${color}80)`,
      }}
    >
      <path
        d="M12 2.5l2.55 6.55 6.95.5-5.3 4.55 1.65 6.85L12 17.4l-5.85 3.55 1.65-6.85L2.5 9.55l6.95-.5L12 2.5z"
        fill={color}
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
