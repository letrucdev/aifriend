# 🤖 AI Friend

> Một ứng dụng chat AI thân thiện, mượt mà — lấy cảm hứng giao diện từ **Together AI** với pastel gradient, typography sắc nét và bảng màu midnight blue đặc trưng.

`aifriend` là một chatbot web được xây dựng trên **Next.js 16 (App Router)** kết hợp **Google Gemini API**, hỗ trợ hội thoại đa phiên, lưu lịch sử, rate limit theo IP và bộ lọc prompt cơ bản.

---

## ✨ Tính năng chính

- 💬 **Chat thời gian thực** với Gemini (mặc định `gemini-2.5-flash`)
- 🗂️ **Đa hội thoại** — sidebar quản lý, đổi tên, xoá conversation
- 🎨 **Design system** lấy cảm hứng Together AI (xem [DESIGN.md](DESIGN.md))
- 🛡️ **Rate limit** in-memory theo IP (phút / ngày)
- 🧹 **Prompt filter** chặn nội dung không phù hợp
- 📱 **Responsive** — hoạt động tốt trên mobile, tablet, desktop
- ⚡ **Turbopack** dev server — khởi động siêu nhanh

---

## 🛠️ Công nghệ sử dụng

### Framework & Runtime
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

### AI & API
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

### UI & Styling
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-F56565?style=for-the-badge&logo=lucide&logoColor=white)

### Tooling
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)

### Chi tiết các package chính

| Mục đích | Package | Vai trò |
|---|---|---|
| 🧠 Gemini SDK | `@google/genai` | Gọi Google Gemini API |
| 🎨 Component | `shadcn` + `radix-ui` | Bộ component primitive accessible |
| 💅 Styling | `tailwindcss` v4 + `tw-animate-css` | Utility CSS + animation |
| 🔧 Class utils | `clsx` + `tailwind-merge` + `class-variance-authority` | Quản lý className theo variant |
| 🍞 Toast | `sonner` | Notification UI |
| 🖼️ Icon | `lucide-react` | Icon set |

---

## 📁 Cấu trúc thư mục

```
aifriend/
├── app/                    # Next.js App Router
│   ├── api/chat/           # Gemini chat endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/               # ChatPanel, ChatInput, Sidebar...
│   └── ui/                 # shadcn primitives
├── hooks/                  # use-chat, use-conversations, use-mobile
├── lib/
│   ├── gemini.ts           # Gemini client
│   ├── prompt-filter.ts    # Lọc nội dung
│   ├── rate-limit.ts       # Rate limit theo IP
│   └── system-prompt.ts    # System prompt
└── DESIGN.md               # Tài liệu design system
```

---

## 🚀 Bắt đầu

### 1. Cài đặt

```bash
npm install
```

### 2. Cấu hình môi trường

Sao chép `.env.example` thành `.env.local` rồi điền API key:

```bash
cp .env.example .env.local
```

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_DAY=100
```

> 🔑 Lấy API key tại: https://aistudio.google.com/apikey

### 3. Chạy dev server

```bash
npm run dev
```

Mở http://localhost:3838

---

## 📜 Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy dev server với Turbopack (port 3838) |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra ESLint |
| `npm run format` | Format code với Prettier |
| `npm run typecheck` | Kiểm tra TypeScript |

---

## 🎨 Design

Tham khảo đầy đủ design system tại [DESIGN.md](DESIGN.md) — bao gồm bảng màu, typography, component, spacing và quy tắc do/don't.

**Điểm nhấn:**
- 🌸 Pastel gradient (pink / blue / lavender)
- 🌌 Midnight blue (`#010120`) cho dark zone
- ✒️ Negative letter-spacing trên mọi cấp typography
- 🔲 Sharp geometry — radius 4px / 8px, không pill

---

## 📝 Thêm component shadcn

```bash
npx shadcn@latest add button
```

Component sẽ được đặt vào `components/ui/`.
