import Link from "next/link"

export function CtaSection() {
  return (
    <section
      className="relative overflow-hidden border-y border-black/6"
      style={{
        background:
          "radial-gradient(60% 60% at 20% 0%, #ffe1f0 0%, transparent 65%), radial-gradient(55% 55% at 80% 30%, #d6e6ff 0%, transparent 65%), radial-gradient(50% 60% at 50% 100%, #c8eaff 0%, transparent 70%), linear-gradient(180deg, #fff5fa 0%, #f0f4ff 100%)",
      }}
    >
      <div className="relative mx-auto w-full max-w-300 px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-center text-[18px] leading-[1.4] font-medium tracking-[-0.01em] text-[#3a6cf4] sm:text-[22px] md:text-[24px]">
          Mây chào bạn nhé, có chuyện khó nói, sẵn sàng lắng nghe
        </p>

        <div className="relative mt-12 grid place-items-center sm:mt-16">
          <span
            aria-hidden
            className="absolute top-[6%] left-[2%] inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/85 px-3 py-2 backdrop-blur-sm sm:left-[6%]"
            style={{ boxShadow: "0 4px 10px rgba(1, 1, 32, 0.1)" }}
          >
            <span className="text-[20px]">☁️</span>
            <span className="text-[10px] font-medium tracking-[0.08em] text-black/75 uppercase sm:text-[11px]">
              Bạn ơi cố lên
            </span>
          </span>

          <svg
            aria-hidden
            className="absolute top-[8%] right-[4%] size-12 sm:size-16 md:size-20"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M10 38 Q 20 18, 38 22 Q 50 24, 56 36 Q 50 32, 42 32 L 50 42 L 38 38 L 42 50 L 32 40 L 28 52 L 26 38 L 14 44 Z"
              fill="#5b9eff"
              stroke="#2d6cd9"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <ellipse cx="22" cy="28" rx="6" ry="3" fill="white" opacity="0.5" />
          </svg>

          <Link
            href="/chat"
            aria-label="Bắt đầu trò chuyện cùng Mây"
            className="relative inline-block leading-[0.85] font-bold tracking-[-0.04em] text-[#9fc6ff] transition-transform hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline-none"
            style={{
              fontSize: "clamp(96px, 19vw, 240px)",
              textShadow: [
                "-2px -2px 0 #ffffff",
                "2px -2px 0 #ffffff",
                "-2px 2px 0 #ffffff",
                "2px 2px 0 #ffffff",
                "-4px 0 0 #ffffff",
                "4px 0 0 #ffffff",
                "0 -4px 0 #ffffff",
                "0 4px 0 #ffffff",
                "-6px -6px 12px rgba(255,255,255,0.9)",
                "6px 6px 18px rgba(124,135,255,0.45)",
                "0 14px 40px rgba(1,1,32,0.18)",
              ].join(", "),
            }}
          >
            Here
          </Link>

          <svg
            aria-hidden
            viewBox="0 0 600 120"
            className="-mt-6 w-[90%] max-w-170 sm:-mt-10"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cta-cloud" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#cfdfff" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path
              d="M40 80 Q 60 30, 130 40 Q 170 0, 240 28 Q 290 4, 340 30 Q 400 8, 460 36 Q 520 22, 560 64 Q 580 90, 540 108 L 80 108 Q 30 104, 40 80 Z"
              fill="url(#cta-cloud)"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <p className="mt-8 text-center text-[16px] tracking-[-0.01em] text-black/70 sm:text-[18px]">
          Click{" "}
          <span className="font-medium text-black">&ldquo;Here&rdquo;</span> để
          tâm sự cùng Mây nhé <span className="text-[#ef2cc1]">{"><"}</span>
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="/chat"
            className="inline-flex h-11 items-center rounded-lg bg-[#010120] px-6 text-[15px] font-medium tracking-[-0.01em] text-white transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#010120]/40 focus-visible:outline-none"
          >
            Bắt đầu trò chuyện
            <span className="ml-2 text-[#bdbbff]">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
