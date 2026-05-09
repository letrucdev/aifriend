import { MonoLabel } from "@/components/chat/mono-label"

const SOCIALS = [
  { name: "Facebook", href: "#", icon: FacebookIcon },
  { name: "Instagram", href: "#", icon: InstagramIcon },
  { name: "X", href: "#", icon: XIcon },
] as const

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#010120] text-white">
      <div className="mx-auto w-full max-w-300 px-5 pt-20 pb-6 sm:px-8 sm:pt-24">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-8">
          <div>
            <MonoLabel className="text-white/55">
              ✱ &nbsp; Stay in touch
            </MonoLabel>
            <p className="mt-4 max-w-md text-[18px] leading-[1.45] tracking-[-0.02em] text-white/85 sm:text-[20px]">
              Follow Mây trên các kênh mạng xã hội để nhận những lời nhắn nhỏ
              ấm áp mỗi ngày nhé.
            </p>

            <ul className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    aria-label={name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-lg border border-white/12 bg-white/6 text-white/85 transition-colors hover:bg-white/[0.14] hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                  >
                    <Icon className="size-4.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:justify-self-end">
            <MonoLabel className="text-white/55">
              ✱ &nbsp; Sitemap
            </MonoLabel>
            <ul className="mt-4 grid gap-2 text-[15px] tracking-[-0.01em] text-white/75">
              <li>
                <a
                  href="/chat"
                  className="hover:text-white focus-visible:text-white focus-visible:outline-none"
                >
                  Trò chuyện với Mây →
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white focus-visible:text-white focus-visible:outline-none"
                >
                  Về Mây
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white focus-visible:text-white focus-visible:outline-none"
                >
                  Quyền riêng tư
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          aria-hidden
          className="mt-16 leading-[0.8] font-medium tracking-[-0.06em] text-white/85 select-none"
          style={{ fontSize: "clamp(120px, 25vw, 320px)" }}
        >
          mây
          <span className="text-[#bdbbff]">.</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/12 pt-6 text-[13px] tracking-[-0.005em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Mây — một người bạn AI nhỏ.
          </p>
          <p className="max-w-md sm:text-right">
            Mây không phải chuyên gia tâm lý. Nếu cậu cần hỗ trợ khẩn cấp, hãy
            gọi đường dây tư vấn{" "}
            <span className="text-white/80">1800-1567</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.24-1.46 1.49-1.46H16.5V4.45c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.81 1.38-3.81 3.91V10.5H8v3h2.41V21h3.09z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  )
}
