# Lưu đánh giá Mây về Google Trang tính

Khi cuộc trò chuyện đạt giới hạn 20 tin nhắn, app sẽ hiện dialog 1–5 sao.
Nếu bạn cấu hình `GOOGLE_SHEETS_WEBHOOK_URL`, đánh giá sẽ được POST sang
Google Apps Script và ghi vào một Sheet do bạn quản lý.

## Setup nhanh (5 phút)

### 1. Tạo Google Trang tính

1. Mở [sheets.new](https://sheets.new) tạo file mới, đặt tên ví dụ
   `Mây – Đánh giá người dùng`.
2. Hàng đầu tiên (header) tự động sẽ được Apps Script tạo, bạn không cần điền.

### 2. Thêm Apps Script

1. Trong Sheet, mở **Extensions → Apps Script**.
2. Xoá nội dung mặc định, dán đoạn dưới đây vào file `Code.gs`:

```javascript
const SHEET_NAME = "Feedback"

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}")
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(SHEET_NAME)
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME)
      sheet.appendRow([
        "Thời gian",
        "Số sao",
        "Tên",
        "Email",
        "Nhận xét",
        "Conversation ID",
        "Số tin nhắn",
        "User-Agent",
        "IP",
      ])
      sheet.setFrozenRows(1)
    }
    sheet.appendRow([
      payload.timestamp || new Date().toISOString(),
      payload.rating,
      payload.name || "",
      payload.email || "",
      payload.comment || "",
      payload.conversationId || "",
      payload.messageCount || "",
      payload.userAgent || "",
      payload.ip || "",
    ])
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
```

3. Lưu (`Ctrl+S`), đặt tên project tuỳ thích.

### 3. Deploy thành Web App

1. Bấm nút **Deploy → New deployment**.
2. Chọn **Type → Web app**.
3. Cấu hình:
   - **Execute as:** *Me (your-email)*
   - **Who has access:** *Anyone* (chỉ những ai biết URL bí mật mới gọi được)
4. Bấm **Deploy**, cấp quyền nếu Google hỏi.
5. Copy **Web app URL** dạng
   `https://script.google.com/macros/s/AKfyc.../exec`.

### 4. Bỏ URL vào `.env.local`

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfyc.../exec
```

Restart `npm run dev`. Mở phiên chat, gửi đủ 20 tin nhắn → dialog đánh giá
hiện ra → submit. Mở Sheet, một dòng mới sẽ xuất hiện trong tab **Feedback**.

## Lưu ý

- URL webhook nên giữ riêng tư — bất cứ ai có URL đều có thể ghi vào Sheet.
- Nếu cần chống spam thêm, có thể đổi Apps Script để kiểm tra một header bí
  mật (ví dụ `X-Feedback-Token`) — nhớ thêm header này vào `app/api/feedback/route.ts`.
- Mỗi lần sửa Apps Script, nhớ **Deploy → Manage deployments → Edit → New
  version** để URL hiện hành chạy code mới (URL không đổi).
- Khi chưa cấu hình `GOOGLE_SHEETS_WEBHOOK_URL`, app vẫn chạy: đánh giá sẽ
  được log ra console server và không lưu đâu cả.
