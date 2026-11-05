import { WikiArticle, WikiSummary } from "@/types/history";
import { cleanAndParseWikiHtml } from "./cleaner";
import { cached, saveSlugTitles } from "@/lib/cache/redis";
import { slugify } from "@/lib/seo/slug";

const WIKI_REST_BASE = "https://vi.wikipedia.org/api/rest_v1";
const WIKI_ACTION_BASE = "https://vi.wikipedia.org/w/api.php";

const WIKI_HEADERS = {
  "User-Agent": "SuVietExplorer/1.0 (https://suviet.dev; contact@suviet.dev)",
  "Api-User-Agent": "SuVietExplorer/1.0 (https://suviet.dev; contact@suviet.dev)",
  Accept: "application/json",
};

export function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .trim();
}

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
      displayTitle: stripHtmlTags(data.titles?.display || data.title),
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
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error(`Lỗi khi fetch summary cho "${title}":`, error);
    return null;
  }
}

const unescapeAttr = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

// Ghi nhớ slug của mọi bài được liên kết để /doc/<slug> tra ngược ra đúng tiêu đề
function rememberLinkedTitles(article: WikiArticle) {
  const entries: Record<string, string> = { [slugify(article.title)]: article.title };
  for (const m of Array.from(article.cleanHtml.matchAll(/data-wiki-title="([^"]+)"/g))) {
    const t = unescapeAttr(m[1]);
    const slug = slugify(t);
    if (slug) entries[slug] = t;
  }
  return saveSlugTitles(entries);
}

export async function fetchWikiArticle(title: string): Promise<WikiArticle | null> {
  const article = await fetchWikiArticleCached(title);
  if (article) await rememberLinkedTitles(article);
  return article;
}

async function fetchWikiArticleCached(title: string): Promise<WikiArticle | null> {
  return cached(`suviet:article:v2:${title}`, 60 * 60 * 24, async () => {
    const direct = await loadWikiArticle(title);
    if (direct) return direct;

    // Tiêu đề không khớp chính xác: tìm bài gần đúng nhất
    const found = await searchWikiTitle(title);
    return found && found !== title ? loadWikiArticle(found) : null;
  });
}

export async function searchWikiTitles(query: string, limit = 1): Promise<string[]> {
  try {
    const res = await fetch(
      `${WIKI_ACTION_BASE}?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&format=json&origin=*`,
      { headers: WIKI_HEADERS, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.query?.search ?? []).map((r: { title: string }) => r.title);
  } catch {
    return [];
  }
}

async function searchWikiTitle(query: string): Promise<string | null> {
  return (await searchWikiTitles(query, 1))[0] ?? null;
}

// Lỗi mạng thoáng qua sẽ bị ISR cache thành 404 nếu không thử lại
async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: WIKI_HEADERS, next: { revalidate: 86400 } });
      if (res.ok || (res.status < 500 && res.status !== 429)) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  throw lastError;
}

async function loadWikiArticle(title: string): Promise<WikiArticle | null> {
  try {
    const [summary, parseRes] = await Promise.all([
      fetchWikiSummary(title),
      fetchWithRetry(
        `${WIKI_ACTION_BASE}?action=parse&page=${encodeURIComponent(title)}&prop=text&redirects=1&format=json&origin=*`
      ),
    ]);

    if (!parseRes.ok) return null;
    const parseData = await parseRes.json();
    const rawHtml = parseData?.parse?.text?.["*"];

    if (!rawHtml) return null;

    const { cleanHtml, toc } = cleanAndParseWikiHtml(rawHtml);

    // Dùng tiêu đề chuẩn sau chuyển hướng để slug và canonical luôn ổn định
    const canonicalTitle = summary?.title || parseData?.parse?.title || title;

    return {
      title: canonicalTitle,
      displayTitle: summary?.displayTitle || canonicalTitle,
      cleanHtml,
      summary: summary || undefined,
      toc,
      originalUrl: `https://vi.wikipedia.org/wiki/${encodeURIComponent(canonicalTitle.replace(/ /g, "_"))}`,
    };
  } catch (error) {
    console.error(`Lỗi khi fetch bài viết "${title}":`, error);
    return null;
  }
}

