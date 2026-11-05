import { formatYear } from "@/lib/constants/timeline-data";
import { OG_SIZE, renderOg } from "@/lib/seo/og";
import { slugToYear } from "@/lib/seo/slug";
import { regimeSummary, yearHeadline } from "@/lib/seo/yearMeta";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Niên biểu đối chiếu theo năm";

export default function Image({ params }: { params: { year: string } }) {
  const year = slugToYear(params.year);
  if (year === null) return renderOg({ title: "Niên biểu lịch sử" });
  const r = regimeSummary(year);
  return renderOg({
    eyebrow: `Niên biểu · Năm ${formatYear(year)}`,
    title: yearHeadline(year) ?? `Lịch sử năm ${formatYear(year)}`,
    subtitle: `Việt Nam: ${r.vn} · Trung Quốc: ${r.cn} · Thế giới: ${r.wd}`,
  });
}
