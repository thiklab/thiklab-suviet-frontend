import { formatYear } from "@/lib/constants/timeline-data";
import { OG_SIZE, renderOg } from "@/lib/seo/og";
import { slugToYear } from "@/lib/seo/slug";
import { regimeSummary, yearHeadline } from "@/lib/seo/yearMeta";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Dòng thời gian theo năm";

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const year = slugToYear((await params).year);
  if (year === null) return renderOg({ title: "Dòng thời gian lịch sử" });
  const r = regimeSummary(year);
  return renderOg({
    eyebrow: `Dòng thời gian · Năm ${formatYear(year)}`,
    title: yearHeadline(year) ?? `Lịch sử năm ${formatYear(year)}`,
    subtitle: `Việt Nam: ${r.vn} · Trung Quốc: ${r.cn} · Thế giới: ${r.wd}`,
  });
}
