import { TOCItem } from "@/types/history";
import { docLinkHref } from "@/lib/seo/slug";

export function cleanAndParseWikiHtml(rawHtml: string): { cleanHtml: string; toc: TOCItem[] } {
  let html = rawHtml;

  // 1. Loại bỏ các bảng mẫu nhiễu, infobox, navbox, hộp cảnh báo
  const unwantedPatterns = [
    /<table[^>]*class="[^"]*(infobox|navbox|metadata|ambox|vertical-navbox)[^"]*"[^>]*>[\s\S]*?<\/table>/gi,
    /<div[^>]*class="[^"]*(navbox|hatnote|mw-empty-elt|reflist|portal)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    /<div[^>]*id="[^"]*(toc|mw-navigation)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    /<sup[^>]*class="[^"]*\breference\b[^"]*"[^>]*>[\s\S]*?<\/sup>/gi,
    /<sup[^>]*class="[^"]*\bnoprint\b[^"]*"[^>]*>[\s\S]*?<\/sup>/gi,
    /<a[^>]*href="[^"]*#cite_(?:note|ref)[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    /<style[^>]*>[\s\S]*?<\/style>/gi,
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<!--[\s\S]*?-->/gi,
  ];

  html = removeBalancedTags(html, "span", /mw-editsection/);
  html = removeBalancedTags(html, "sup", /(^|\s)(mw-ref|reference)(\s|$)/);

  unwantedPatterns.forEach((pattern) => {
    html = html.replace(pattern, "");
  });

  // 1b. Cắt bỏ toàn bộ các phần không cần thiết (cả tiêu đề lẫn nội dung)
  html = html.replace(
    /<div[^>]*class="[^"]*mw-heading[^"]*"[^>]*>\s*(<h[1-6][\s\S]*?<\/h[1-6]>)\s*<\/div>/gi,
    "$1"
  );
  html = removeUnwantedSections(html);

  // 2. Trích xuất mục lục (TOC) từ các thẻ <h2> và <h3>
  const toc: TOCItem[] = [];
  let headingIndex = 0;

  html = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, levelStr, attrs, innerContent) => {
    headingIndex++;
    const level = parseInt(levelStr, 10);
    const text = innerContent.replace(/<[^>]+>/g, "").trim();

    // Bỏ qua các mục phụ không cần thiết như Chú thích, Xem thêm, Thư mục
    if (["chú thích", "tham khảo", "xem thêm", "liên kết ngoài", "nguồn"].includes(text.toLowerCase())) {
      return "";
    }

    const slug = `heading-${headingIndex}-${text.toLowerCase().replace(/[^\w\u00C0-\u1EF9]/g, "-")}`;
    toc.push({ id: slug, text, level });
    return `<h${level} id="${slug}" class="editorial-heading-${level}">${innerContent}</h${level}>`;
  });

  // 3. Chuẩn hóa mọi liên kết: nội bộ -> /doc/<slug>, còn lại -> Wikipedia hoặc bỏ link
  html = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_m, attrs: string, text: string) =>
    rewriteAnchor(attrs, text)
  );

  // 4. Ảnh: tải lười, URL tuyệt đối
  html = html.replace(/<img\b([^>]*)>/gi, (_m, attrs: string) => {
    const fixed = attrs.replace(/\bsrc=(["'])\/\//i, "src=$1https://");
    return `<img loading="lazy" decoding="async"${fixed}>`;
  });

  html = removeBalancedTags(html, "span", /mw-editsection/);

  return { cleanHtml: html, toc };
}

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function rewriteAnchor(attrs: string, text: string): string {
  const href = /\bhref=["']([^"']*)["']/i.exec(attrs)?.[1];
  if (!href) return text;
  if (/\bclass=["'][^"']*\bnew\b/i.test(attrs) || /redlink=1/.test(href)) return text; // trang chưa tồn tại
  if (href.startsWith("#")) return text;

  const wiki = /^\/wiki\/([^"':#?]+)(#.*)?$/.exec(href);
  if (wiki) {
    let title: string;
    try {
      title = decodeURIComponent(wiki[1]).replace(/_/g, " ");
    } catch {
      return text;
    }
    return `<a href="${docLinkHref(title)}" class="wiki-preview-link" data-wiki-title="${escapeAttr(title)}">${text}</a>`;
  }

  let external = href;
  if (href.startsWith("//")) external = `https:${href}`;
  else if (href.startsWith("/")) external = `https://vi.wikipedia.org${href}`;
  if (!/^https?:\/\//i.test(external)) return text;
  return `<a href="${escapeAttr(external)}" target="_blank" rel="noopener noreferrer nofollow">${text}</a>`;
}

const UNWANTED_SECTIONS = [
  "chú thích",
  "tham khảo",
  "tài liệu tham khảo",
  "xem thêm",
  "thư mục",
  "liên kết ngoài",
  "nguồn",
];

// Xóa từ tiêu đề không cần thiết đến tiêu đề cùng cấp hoặc cao hơn kế tiếp
function removeUnwantedSections(html: string): string {
  const headingRe = /<h([2-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings: { start: number; level: number; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(html))) {
    headings.push({
      start: m.index,
      level: parseInt(m[1], 10),
      text: m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().toLowerCase(),
    });
  }

  const ranges: [number, number][] = [];
  for (let i = 0; i < headings.length; i++) {
    if (!UNWANTED_SECTIONS.includes(headings[i].text)) continue;
    let end = html.length;
    for (let j = i + 1; j < headings.length; j++) {
      if (headings[j].level <= headings[i].level) {
        end = headings[j].start;
        break;
      }
    }
    ranges.push([headings[i].start, end]);
  }

  let result = "";
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start < cursor) continue;
    result += html.slice(cursor, start);
    cursor = end;
  }
  return result + html.slice(cursor);
}

// Xóa thẻ (kể cả lồng nhau) có class khớp pattern, ví dụ "[sửa | sửa mã nguồn]"
function removeBalancedTags(html: string, tag: string, classPattern: RegExp): string {
  const openRe = new RegExp(`<${tag}\\b[^>]*\\bclass\\s*=\\s*["']([^"']*)["'][^>]*>`, "gi");
  const tokenRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  let result = "";
  let cursor = 0;
  let m: RegExpExecArray | null;

  while ((m = openRe.exec(html))) {
    if (m.index < cursor || !classPattern.test(m[1])) continue;
    tokenRe.lastIndex = m.index;
    let depth = 0;
    let end = html.length;
    let t: RegExpExecArray | null;
    while ((t = tokenRe.exec(html))) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) {
        end = t.index + t[0].length;
        break;
      }
    }
    result += html.slice(cursor, m.index);
    cursor = end;
    openRe.lastIndex = end;
  }
  return result + html.slice(cursor);
}
