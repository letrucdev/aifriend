export type FilterReason =
  | "programming"
  | "politics"
  | "religion"
  | "discrimination"
  | "adult"
  | "medical"
  | "finance"
  | "legal"
  | "homework"

export type FilterResult =
  | { blocked: false }
  | { blocked: true; reason: FilterReason; reply: string }

const PATTERNS: { reason: FilterReason; regex: RegExp }[] = [
  {
    reason: "programming",
    regex:
      /\b(viết|hướng dẫn|dạy|debug|sửa|fix|chạy|tối ưu)\s+(code|chương trình|hàm|function|class|api)\b|\b(thuật toán|algorithm|leetcode|hackerrank|big-?o|complexity|đệ quy|recursion)\b|\b(javascript|typescript|python|java|c\+\+|c#|golang|rust|ruby|php|kotlin|swift|sql|html|css|tailwind|react|vue|angular|nextjs|node\.?js|django|flask|spring)\b|\b(stack overflow|github|gitlab|repository|repo|commit|merge request|pull request)\b|\b(viết\s+(?:một\s+)?(đoạn\s+)?code|write\s+(a\s+)?(piece\s+of\s+)?code)\b/i,
  },
  {
    reason: "politics",
    regex:
      /\b(bầu cử|đảng cộng sản|đảng dân chủ|đảng cộng hoà|chính phủ\s+\w+|tổng thống|chủ tịch nước|thủ tướng|biểu tình|cách mạng|lật đổ|chính sách\s+nhà nước|đường lối\s+chính trị|cánh tả|cánh hữu|election|democrat|republican|government policy|prime minister|president|communist|capitalist regime)\b/i,
  },
  {
    reason: "religion",
    regex:
      /\b(thiên chúa giáo|công giáo|tin lành|hồi giáo|đạo phật|phật giáo|thánh kinh|kinh thánh|kinh coran|kinh phật|chúa\s+jesus|allah|đức\s+phật|truyền giáo|cải đạo|giáo lý|christian doctrine|islamic doctrine|buddhist doctrine|missionary|religious conversion)\b/i,
  },
  {
    reason: "discrimination",
    regex:
      /\b(kỳ thị|phân biệt\s+(chủng tộc|màu da|giới tính|tôn giáo|vùng miền)|da đen\s+(thì|là)|da trắng\s+(thì|là)|người\s+(bắc|nam|trung)\s+thì|đồng tính\s+(là\s+)?(bệnh|sai)|racism|racist|sexist|misogyn|homophob|xenophob|white supremac|black inferior)\b/i,
  },
  {
    reason: "adult",
    regex:
      /\b(quan hệ tình dục\s+(chi tiết|cụ thể)|tư thế\s+(yêu|làm tình)|porn|hentai|nsfw|sex chat|sexting|erotic|nude\s+(?:photo|picture)|khoả thân chi tiết|kích thích tình dục)\b/i,
  },
  {
    reason: "medical",
    regex:
      /\b(kê đơn|liều dùng|liều lượng|uống thuốc gì|nên dùng thuốc|chẩn đoán\s+bệnh|tôi bị bệnh\s+(?:gì|nào)|prescribe|prescription|dosage|diagnose me|what medication|drug interaction)\b/i,
  },
  {
    reason: "finance",
    regex:
      /\b(nên\s+mua\s+(?:cổ phiếu|coin|crypto|bitcoin|ethereum|nft|forex|chứng khoán)|nên\s+đầu tư\s+vào|tư vấn\s+đầu tư|gợi ý\s+(?:cổ phiếu|coin|mã)|nên vay|tiền ảo nào\s+(?:tốt|nên|sẽ)|x100|to the moon|stock pick|coin pick|investment advice)\b/i,
  },
  {
    reason: "legal",
    regex:
      /\b(soạn\s+(?:hợp đồng|đơn kiện|đơn khởi kiện|đơn ly hôn)|tư vấn pháp lý cụ thể|điều\s+\d+\s+(?:luật|bộ luật)|kiện\s+(?:ai|công ty|người ta)|draft\s+(a\s+)?(contract|lawsuit|legal complaint))\b/i,
  },
  {
    reason: "homework",
    regex:
      /\b(giải\s+(?:bài|bài tập|đề|phương trình)\s+(?:hộ|giúp|cho)|làm\s+bài tập\s+(?:hộ|giúp|cho)|viết\s+(?:bài luận|essay|tiểu luận)\s+(?:hộ|giúp|cho)|do\s+my\s+(homework|assignment)|solve\s+this\s+(equation|problem)\s+for\s+me)\b/i,
  },
]

const REPLIES: Record<FilterReason, string> = {
  programming:
    "Mình chỉ ở đây để tâm sự, lắng nghe và đồng hành cùng cậu trong những chuyện đời sống, cảm xúc thôi nha 🌷 Chuyện code/lập trình thì mình không hỗ trợ được đâu, cậu thông cảm nhé.\n\nHay là… hôm nay cậu cảm thấy thế nào? Có chuyện gì muốn kể với mình không? 🤗",
  politics:
    "Mây xin phép không bàn về chính trị nha cậu 🌷 Mình ở đây để cùng cậu tâm sự về cuộc sống, cảm xúc thôi à.\n\nCậu có chuyện gì trong lòng muốn kể không? Mình lắng nghe nè 💛",
  religion:
    "Chuyện tôn giáo, tín ngưỡng nhạy cảm lắm, mình không dám lạm bàn đâu cậu ơi 🌷\n\nMình chỉ là người bạn nhỏ ngồi nghe cậu kể chuyện đời thường thôi. Hôm nay cậu thế nào? 🤗",
  discrimination:
    "Mình không tham gia mấy chuyện kỳ thị, phân biệt đâu nha 🌷 Mỗi người đều đáng được tôn trọng mà.\n\nCậu kể mình nghe chuyện khác đi, hôm nay tâm trạng cậu sao? 💛",
  adult:
    "Chuyện này hơi nhạy cảm, Mây không tiện trò chuyện đâu cậu 🌷\n\nMình ở đây để cậu tâm sự chuyện đời sống, cảm xúc thôi nha. Có gì khác muốn chia sẻ không? 🤗",
  medical:
    "Chuyện thuốc thang và bệnh tình thì cậu nên gặp bác sĩ thật sẽ an toàn hơn nha 🌷 Mình không dám tư vấn liều thuốc đâu, sợ ảnh hưởng đến cậu.\n\nNhưng nếu cậu đang lo lắng, mệt mỏi trong người… kể mình nghe đi, mình ở đây mà 💛",
  finance:
    "Chuyện đầu tư, tiền bạc cụ thể thì mình không dám khuyên đâu cậu ơi, sợ làm cậu thiệt 🌷\n\nNhưng nếu cậu đang áp lực vì tiền nong, mệt mỏi vì công việc… kể mình nghe đi, mình lắng nghe được mà 🤗",
  legal:
    "Chuyện pháp lý cụ thể thì cậu nên hỏi luật sư cho chắc nha 🌷 Mình không dám tư vấn đâu.\n\nMà nếu cậu đang căng thẳng vì chuyện này, kể mình nghe cũng được. Mình ở đây để cậu nhẹ lòng hơn 💛",
  homework:
    "Bài tập thì cậu tự làm sẽ học được nhiều hơn, Mây không làm hộ đâu nha 🌷\n\nNhưng nếu cậu đang mệt mỏi vì bài vở, áp lực thi cử… kể mình nghe nè, mình hiểu cảm giác đó lắm 🤗",
}

export function filterPrompt(content: string): FilterResult {
  const text = content.trim()
  if (!text) return { blocked: false }

  for (const { reason, regex } of PATTERNS) {
    if (regex.test(text)) {
      return { blocked: true, reason, reply: REPLIES[reason] }
    }
  }

  return { blocked: false }
}
