export const SITE_NAME = "Sử Việt Niên Biểu";

export const SITE_DESCRIPTION =
  "Đối chiếu lịch sử Việt Nam với Trung Quốc và thế giới theo từng mốc năm, kèm nội dung mở từ Wikipedia tiếng Việt trong không gian đọc tĩnh lặng.";

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (productionHost ? `https://${productionHost}` : "https://suviet.dev")
).replace(/\/+$/, "");

// Ngày biên soạn nội dung tĩnh gần nhất; cập nhật khi sửa dữ liệu dòng thời gian
export const CONTENT_LAST_MODIFIED = "2026-11-05";

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
