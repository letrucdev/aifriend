import Link from "next/link"

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-black/6 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-300 items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="text-[22px] leading-none font-medium tracking-[-0.04em] text-black"
        >
          mây
          <span className="text-[#bdbbff]">.</span>
        </Link>

        <Link
          href="/chat"
          className="inline-flex h-9 items-center rounded-lg bg-[#010120] px-4 text-[14px] font-medium tracking-[-0.01em] text-white transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#010120]/40 focus-visible:outline-none"
        >
          Trò chuyện ngay
          <span className="ml-2 text-[#bdbbff]">→</span>
        </Link>
      </div>
    </nav>
  )
}
