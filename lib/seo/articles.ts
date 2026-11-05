import { cache } from "react";
import { CURATED_MILESTONES } from "@/lib/constants/milestones";
import { EVENTS } from "@/lib/constants/timeline-data";
import { cached, getSlugTitle } from "@/lib/cache/redis";
import { searchWikiTitles } from "@/lib/wikipedia/client";
import { slugify } from "./slug";

const EXTRA_TITLES = ["Đại Việt", "Lịch sử Việt Nam", "Bắc thuộc", "Nhà Lý", "Nhà Trần", "Nhà Lê sơ", "Nhà Nguyễn"];

const curatedTitles = Object.values(CURATED_MILESTONES).flatMap((entry) =>
  [...entry.vietnam, ...entry.china, ...entry.world].map((ev) => ev.wikiTitle)
);

// slug -> tiêu đề bài Wikipedia, dùng cho sitemap và tra cứu nhanh không cần gọi API
export const DOC_REGISTRY: Map<string, string> = new Map();
for (const title of [...EVENTS.map((e) => e[3]), ...curatedTitles, ...EXTRA_TITLES]) {
  if (!title) continue;
  const slug = slugify(title);
  if (slug && !DOC_REGISTRY.has(slug)) DOC_REGISTRY.set(slug, title);
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const resolveDocTitle = cache(async (slug: string, hint?: string): Promise<string | null> => {
  if (slug.length > 120 || !SLUG_PATTERN.test(slug)) return null;

  // Tiêu đề gốc đi kèm link nội bộ; chỉ tin khi khớp đúng slug nên không phụ thuộc Redis
  if (hint && hint.length <= 300 && slugify(hint) === slug) return hint;

  const known = DOC_REGISTRY.get(slug);
  if (known) return known;

  const remembered = await getSlugTitle(slug);
  if (remembered) return remembered;

  return cached<string>(
    `suviet:slug:v1:${slug}`,
    60 * 60 * 24 * 7,
    async () => {
      const results = await searchWikiTitles(slug.replace(/-/g, " "), 10);
      return results.find((t) => slugify(t) === slug) ?? null;
    },
    { negativeTtl: 60 * 60 }
  );
});
