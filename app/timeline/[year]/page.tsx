import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { YearView } from "@/components/timeline/YearView";
import { buildMetadata } from "@/lib/seo/meta";
import { yearToSlug, slugToYear } from "@/lib/seo/slug";
import { INDEXED_YEARS } from "@/lib/seo/years";
import { yearDescription, yearPath, yearTitle } from "@/lib/seo/yearMeta";

export const revalidate = 86400;

export function generateStaticParams() {
  return INDEXED_YEARS.map((y) => ({ year: yearToSlug(y) }));
}

export function generateMetadata({ params }: { params: { year: string } }): Metadata {
  const year = slugToYear(params.year);
  if (year === null) return { title: "Không tìm thấy năm", robots: { index: false } };
  return buildMetadata({
    title: yearTitle(year),
    description: yearDescription(year),
    path: yearPath(year),
    type: "article",
  });
}

export default function TimelineYearPage({ params }: { params: { year: string } }) {
  const year = slugToYear(params.year);
  if (year === null) notFound();
  if (params.year !== yearToSlug(year)) permanentRedirect(yearPath(year));
  return <YearView year={year} />;
}
