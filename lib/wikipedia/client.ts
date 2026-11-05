import { WikiArticle, WikiSummary } from "@/types/history";
import { cleanAndParseWikiHtml } from "./cleaner";

const WIKI_REST_BASE = "https://vi.wikipedia.org/api/rest_v1";
const WIKI_ACTION_BASE = "https://vi.wikipedia.org/w/api.php";

const WIKI_HEADERS = {
  "User-Agent": "SuVietExplorer/1.0 (https://suviet.dev; contact@suviet.dev)",
  "Api-User-Agent": "SuVietExplorer/1.0 (https://suviet.dev; contact@suviet.dev)",
  Accept: "application/json",
};

export async function fetchWikiSummary(title: string): Promise<WikiSummary | null> {
  try {
    const url = `${WIKI_REST_BASE}/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
    const res = await fetch(url, {
      headers: WIKI_HEADERS,
      next: { revalidate: 86400 }, // Cache 24 giờ
    });

    if (!res.ok) return null;
    const data = await res.json();

    return {
      title: data.title,
      displayTitle: data.titles?.display || data.title,
      extract: data.extract,
      thumbnail: data.thumbnail
        ? {
            source: data.thumbnail.source,
            width: data.thumbnail.width,
            height: data.thumbnail.height,
          }
        : undefined,
      pageUrl: data.content_urls?.desktop?.page || `https://vi.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      description: data.description,
    };
  } catch (error) {
    console.error(`Lỗi khi fetch summary cho "${title}":`, error);
    return null;
  }
}

export async function fetchWikiArticle(title: string): Promise<WikiArticle | null> {
  try {
    const [summary, parseRes] = await Promise.all([
      fetchWikiSummary(title),
      fetch(
        `${WIKI_ACTION_BASE}?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&origin=*`,
        { headers: WIKI_HEADERS, next: { revalidate: 86400 } }
      ),
    ]);

    if (!parseRes.ok) return null;
    const parseData = await parseRes.json();
    const rawHtml = parseData?.parse?.text?.["*"];

    if (!rawHtml) return null;

    const { cleanHtml, toc } = cleanAndParseWikiHtml(rawHtml);

    return {
      title,
      displayTitle: summary?.displayTitle || title,
      cleanHtml,
      summary: summary || undefined,
      toc,
      originalUrl: `https://vi.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };
  } catch (error) {
    console.error(`Lỗi khi fetch bài viết "${title}":`, error);
    return null;
  }
}

