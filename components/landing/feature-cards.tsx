import { MonoLabel } from "@/components/chat/mono-label"

const FEATURES = [
  {
    label: "01 · Luôn lắng nghe bạn",
    metric: "24/7",
    title: "Lắng nghe mọi lúc",
    body: "Không cần hẹn lịch. 3 giờ sáng cũng có Mây nè, cứ kể đi nha.",
  },
  {
    label: "02 · An toàn",
    metric: "0",
    title: "Phán xét — không có",
    body: "Mây không phán xét, không khuyên đại. Chỉ ở bên cạnh và lắng nghe thôi.",
  },
  {
    label: "03 · Bí mật",
    metric: "100%",
    title: "Riêng tư & an toàn",
    body: "Câu chuyện của cậu là của cậu. Mây không lưu lại để khoe ai hết.",
  },
]

export function FeatureCards() {
  return (
    <section className="mx-auto w-full max-w-300 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mb-10 flex flex-col items-start gap-3 sm:mb-14">
        <MonoLabel className="text-black/60">
          ✱ &nbsp; What Mây offers
        </MonoLabel>
        <h2 className="max-w-2xl text-[28px] leading-[1.15] font-medium tracking-[-0.03em] text-black sm:text-[36px] md:text-[40px]">
          Một góc nhỏ <span className="text-black/50">— ấm áp, riêng tư</span>,
          cho những lúc cậu cần được lắng nghe.
        </h2>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.label}
            className="group relative flex flex-col rounded-[8px] border border-black/8 bg-white p-6 transition-shadow hover:[box-shadow:0_8px_20px_rgba(1,1,32,0.12)]"
            style={{
              boxShadow: "0 4px 10px rgba(1, 1, 32, 0.06)",
            }}
          >
            <p className="text-black/55">{f.label}</p>
            <div
              className="mt-6 leading-[0.95] font-medium tracking-[-0.04em] text-black"
              style={{ fontSize: "clamp(48px, 5.5vw, 64px)" }}
            >
              {f.metric}
            </div>
            <h3 className="mt-3 text-[20px] leading-[1.2] font-medium tracking-[-0.02em] text-black">
              {f.title}
            </h3>
            <p className="mt-2 text-[15px] leading-normal tracking-[-0.01em] text-black/65">
              {f.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
