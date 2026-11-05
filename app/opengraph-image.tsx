import { OG_SIZE, renderOg } from "@/lib/seo/og";

export const runtime = "nodejs";
export const alt = "Sử Việt Niên Biểu — Niên biểu lịch sử Việt Nam đối chiếu thế giới";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    title: "Khám phá Sử Việt ngàn năm",
    subtitle: "Đối chiếu Việt Nam – Trung Quốc – Thế giới theo từng mốc năm",
  });
}
