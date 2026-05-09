export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-300 px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
      <p className="text-black/60">
        ✱ &nbsp; Mây rất vui khi được trò chuyện với cậu ^^
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10">
        <div
          className="relative aspect-16/10 overflow-hidden rounded-[8px] border border-black/6"
          style={{
            background:
              "radial-gradient(60% 60% at 25% 30%, #f8c8e6 0%, transparent 65%), radial-gradient(55% 55% at 78% 35%, #d8c4ff 0%, transparent 65%), radial-gradient(60% 70% at 50% 90%, #d4e8a3 0%, transparent 70%), linear-gradient(135deg, #fef0f6 0%, #ece4ff 50%, #effbe1 100%)",
            boxShadow: "0 4px 10px rgba(1, 1, 32, 0.1)",
          }}
        >
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/30 backdrop-blur-sm"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.36-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z" />
            </svg>
          </span>

          <span
            aria-hidden
            className="absolute top-6 left-6 inline-flex items-center gap-1.5 rounded-[4px] border border-white/40 bg-white/40 px-2 py-1 backdrop-blur-md"
          >
            <span className="size-1.5 rounded-full bg-[#ef2cc1]" />
            <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-black/70 uppercase">
              Page 01
            </span>
          </span>
        </div>

        <div className="md:pl-2">
          <p className="text-[20px] leading-[1.45] tracking-[-0.02em] text-black sm:text-[22px] md:text-[24px]">
            Xin chào, mình là{" "}
            <span className="text-black/85 italic">&ldquo;mây&rdquo;</span>, một
            dự án trí tuệ nhân tạo sẽ ở bên cạnh khi cậu cảm thấy thế giới này
            đang trôi quá nhanh, hãy tìm mây khi cậu đang lạc lối trong suy nghĩ
            của mình nhé.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex size-9 items-center justify-center rounded-full bg-[#fdf3f8] text-[18px]"
            >
              🌷
            </span>
            <span className="text-[14px] tracking-[-0.01em] text-black/60">
              một góc nhỏ để cậu trút lòng, không vội, không phán xét.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
