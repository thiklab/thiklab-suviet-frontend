export function truncate(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.\-–—]+$/, "")}…`;
}

// Đưa mô tả về khoảng 120–160 ký tự; nếu quá ngắn thì nối thêm câu bổ sung
export function fitDescription(text: string, pad: string, min = 120, max = 160): string {
  let t = text.replace(/\s+/g, " ").trim();
  if (t.length < min) t = `${t} ${pad}`.trim();
  return truncate(t, max);
}
