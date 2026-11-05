import { cache } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ReaderView } from "@/components/reader/ReaderView";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/meta";
import { resolveDocTitle } from "@/lib/seo/articles";
import { docLinkHref, slugify } from "@/lib/seo/slug";
import { CONTENT_LAST_MODIFIED } from "@/lib/seo/site";
import { fitDescription, truncate } from "@/lib/seo/text";
import { fetchWikiArticle } from "@/lib/wikipedia/client";

// Trang đọc searchParams (?t=) nên render theo yêu cầu; dữ liệu Wikipedia vẫn được cache ở tầng fetch/Redis
export const dynamic = "force-dynamic";

type DocProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string | string[] }>;
};

const loadArticle = cache(async (slug: string, hint?: string) => {
  const title = await resolveDocTitle(slug, hint);
  return title ? fetchWikiArticle(title) : null;
});

export async function generateMetadata({ params, searchParams }: DocProps): Promise<Metadata> {
  const { slug } = await params;
  const { t } = await searchParams;
  const article = await loadArticle(slug, typeof t === "string" ? t : undefined);
  if (!article) return { title: "Không tìm thấy bài viết", robots: { index: false } };

  const canonicalSlug = slugify(article.title);
  return buildMetadata({
    title: truncate(article.displayTitle, 40),
    description: fitDescription(
      article.summary?.extract || article.summary?.description || article.displayTitle,
      "Tư liệu lịch sử Việt Nam từ Wikipedia tiếng Việt, trình bày trong không gian đọc tĩnh lặng.",
      120,
      160
    ),
    path: `/doc/${canonicalSlug}`,
    type: "article",
    modifiedTime: article.summary?.timestamp,
  });
}

export default async function DocPage({ params, searchParams }: DocProps) {
  const { slug } = await params;
  const { t } = await searchParams;
  const article = await loadArticle(slug, typeof t === "string" ? t : undefined);
  if (!article) notFound();

  const canonicalSlug = slugify(article.title);
  if (canonicalSlug !== slug) permanentRedirect(docLinkHref(article.title));

  const path = `/doc/${canonicalSlug}`;
  const modified = article.summary?.timestamp ?? CONTENT_LAST_MODIFIED;

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            headline: truncate(article.displayTitle, 110),
            description: article.summary?.extract?.slice(0, 300) || article.displayTitle,
            path,
            basedOn: article.originalUrl,
            dateModified: modified,
            image: article.summary?.thumbnail?.source,
          }),
          breadcrumbLd([
            { name: "Trang chủ", path: "/" },
            { name: "Tư liệu", path: "/timeline" },
            { name: article.displayTitle, path },
          ]),
        ]}
      />
      <ReaderView article={article} />
    </>
  );
}
