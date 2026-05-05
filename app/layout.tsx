import type { Metadata } from "next"
import { Playpen_Sans } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const playpenSans = Playpen_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
})

const title = "Mây — AI bạn thân lắng nghe cậu 🌸"
const description =
  "Một người bạn AI dễ thương, ngọt ngào, sẵn sàng lắng nghe và đồng hành cùng bạn trong những chuyện đời sống, cảm xúc thường ngày."

export const metadata: Metadata = {
  title,
  description,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "vi_VN",
    siteName: "Mây",
    images: [
      {
        url: "/PinkPearl.jpg",
        width: 837,
        height: 960,
        alt: "Mây — AI bạn thân lắng nghe cậu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/PinkPearl.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("antialiased", playpenSans.variable, "font-sans")}
    >
      <body suppressHydrationWarning>
        <TooltipProvider delayDuration={150}>
          {children}
          <Toaster position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  )
}
