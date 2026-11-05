import type { MetadataRoute } from "next";
import { fetchWikiSummary } from "@/lib/wikipedia/client";
import { slugify } from "@/lib/seo/slug";
import { DOC_REGISTRY } from "@/lib/seo/articles";
import { CONTENT_LAST_MODIFIED, absoluteUrl } from "@/lib/seo/site";
import { INDEXED_YEARS } from "@/lib/seo/years";
import { yearPath } from "@/lib/seo/yearMeta";

export const revalidate = 86400;

// Chỉ đưa vào sitemap các bài thật sự tồn tại, dùng tiêu đề chuẩn và ngày sửa đổi từ Wikipedia
async function resolveDoc(title: string): Promise<{ slug: string; lastModified: Date } | null> {
  try {
    const summary = await fetchWikiSummary(title);
    if (!summary) return null;
    return {
      slug: slugify(summary.title),
      lastModified: summary.timestamp ? new Date(summary.timestamp) : new Date(CONTENT_LAST_MODIFIED),
    };
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new Date(CONTENT_LAST_MODIFIED);

  const titles = Array.from(DOC_REGISTRY.values());
  const seen = new Set<string>();
  const docEntries: MetadataRoute.Sitemap = [];
  for (let i = 0; i < titles.length; i += 10) {
    const batch = await Promise.all(titles.slice(i, i + 10).map(resolveDoc));
    for (const doc of batch) {
      if (!doc || !doc.slug || seen.has(doc.slug)) continue;
      seen.add(doc.slug);
      docEntries.push({
        url: absoluteUrl(`/doc/${doc.slug}`),
        lastModified: doc.lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return [
    { url: absoluteUrl("/"), lastModified: base, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/pathways"), lastModified: base, changeFrequency: "monthly", priority: 0.8 },
    ...INDEXED_YEARS.map((y) => ({
      url: absoluteUrl(yearPath(y)),
      lastModified: base,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...docEntries,
  ];
}
