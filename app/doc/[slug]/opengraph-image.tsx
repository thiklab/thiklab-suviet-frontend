import { OG_SIZE, renderOg } from "@/lib/seo/og";
import { resolveDocTitle } from "@/lib/seo/articles";
import { truncate } from "@/lib/seo/text";
import { fetchWikiSummary } from "@/lib/wikipedia/client";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tư liệu lịch sử Việt Nam";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const title = await resolveDocTitle((await params).slug);
  const summary = title ? await fetchWikiSummary(title) : null;
  return renderOg({
    eyebrow: "Tư liệu lịch sử",
    title: summary?.displayTitle ?? "Tư liệu lịch sử Việt Nam",
    subtitle: summary?.description ? truncate(summary.description, 120) : undefined,
  });
}
