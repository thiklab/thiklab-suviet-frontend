import type { Metadata } from "next";
import { YearView } from "@/components/timeline/YearView";
import { buildMetadata } from "@/lib/seo/meta";
import { yearDescription, yearPath, yearTitle } from "@/lib/seo/yearMeta";

export const revalidate = 86400;

const DEFAULT_YEAR = 938;

// Trang gốc /timeline hiển thị mốc 938 và canonical về /timeline/938 để không trùng nội dung
export const metadata: Metadata = buildMetadata({
  title: yearTitle(DEFAULT_YEAR),
  description: yearDescription(DEFAULT_YEAR),
  path: yearPath(DEFAULT_YEAR),
  type: "article",
});

export default function TimelinePage() {
  return <YearView year={DEFAULT_YEAR} />;
}
