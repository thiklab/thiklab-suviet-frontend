import { ParallelTimelineEntry, TimelineEvent } from "@/types/history";
import { CURATED_MILESTONES } from "@/lib/constants/milestones";

const VN_DYNASTIES = [
  "hồng bàng", "văn lang", "âu lạc", "nam việt", "hai bà trưng", "nhà tiền lý", "vạn xuân",
  "nhà triệu việt vương", "nhà mai", "nhà phùng", "nhà khúc", "nhà dương", "nhà ngô",
  "nhà đinh", "nhà tiền lê", "nhà lý", "nhà trần", "nhà hồ", "nhà hậu trần", "nhà lê",
  "nhà hậu lê", "lê sơ", "lê trung hưng", "nhà mạc", "chúa trịnh", "chúa nguyễn",
  "nhà tây sơn", "tây sơn", "nhà nguyễn", "đại cồ việt", "đại việt", "đại ngu", "đại nam",
  "việt nam dân chủ cộng hòa", "việt nam cộng hòa", "cộng hòa xã hội chủ nghĩa việt nam",
  "quốc gia việt nam", "đế quốc việt nam", "an nam", "giao chỉ", "giao châu",
];

const VN_KEYWORDS = [
  ...VN_DYNASTIES,
  "việt nam", "thăng long", "quân nguyên", "trần hưng đạo", "nguyễn huệ", "quang trung",
  "quân thanh", "ngô quyền", "bạch đằng", "hồ chí minh", "hà nội", "sài gòn", "huế",
  "gia long", "minh mạng", "khởi nghĩa", "đinh bộ lĩnh", "hoa lư", "lê lợi", "lam sơn",
  "điện biên phủ", "hải phòng", "đà nẵng",
];

const CHINA_DYNASTIES = [
  "nhà hạ", "nhà thương", "nhà ân", "nhà chu", "tây chu", "đông chu", "xuân thu", "chiến quốc",
  "nhà tần", "nhà hán", "tây hán", "đông hán", "nhà tân", "tam quốc", "tào ngụy", "thục hán",
  "đông ngô", "nhà tấn", "tây tấn", "đông tấn", "thập lục quốc", "nam bắc triều",
  "lưu tống", "nam tề", "nhà lương", "bắc ngụy", "đông ngụy", "tây ngụy", "bắc tề", "bắc chu",
  "nhà tùy", "nhà đường", "ngũ đại thập quốc", "hậu lương", "hậu đường", "hậu tấn", "hậu hán",
  "hậu chu", "nhà tống", "bắc tống", "nam tống", "nhà liêu", "tây hạ", "nhà kim", "nhà nguyên",
  "nhà minh", "nam minh", "nhà thanh", "mãn thanh", "thái bình thiên quốc",
  "trung hoa dân quốc", "cộng hòa nhân dân trung hoa",
];

const CHINA_KEYWORDS = [
  ...CHINA_DYNASTIES,
  "trung quốc", "trung hoa", "đại lục", "bắc kinh", "nam kinh", "thượng hải", "trùng khánh",
  "quảng châu", "tây an", "lạc dương", "khai phong", "hàng châu", "tử cấm thành",
  "hốt tất liệt", "thành cát tư hãn", "càn long", "khang hi", "ung chính", "tào tháo", "lưu bị",
  "tôn quyền", "tần thủy hoàng", "võ tắc thiên", "tôn trung sơn", "tưởng giới thạch",
  "mao trạch đông", "đặng tiểu bình", "quốc dân đảng", "đảng cộng sản trung quốc",
  "thiên an môn", "hồng kông", "ma cao",
];

const matchesKeyword = (text: string, kw: string) =>
  new RegExp(`(?<![\\p{L}])${kw}(?![\\p{L}])`, "u").test(text);

export async function fetchYearParallelEvents(year: number): Promise<ParallelTimelineEntry> {
  const curated = CURATED_MILESTONES[year];
  const defaultEntry: ParallelTimelineEntry = {
    year,
    label: curated?.label,
    eraId: getEraIdFromYear(year),
    vietnam: curated ? [...curated.vietnam] : [],
    china: curated ? [...curated.china] : [],
    world: curated ? [...curated.world] : [],
  };

  try {
    const res = await fetch(
      `https://vi.wikipedia.org/w/api.php?action=parse&page=${year}&prop=wikitext&format=json&origin=*`,
      {
        headers: {
          "User-Agent": "SuVietExplorer/1.0 (https://suviet.dev; contact@suviet.dev)",
          "Api-User-Agent": "SuVietExplorer/1.0 (https://suviet.dev; contact@suviet.dev)",
        },
        next: { revalidate: 86400 * 7 },
      }
    );

    if (!res.ok) return defaultEntry;
    const data = await res.json();
    const wikitext = data?.parse?.wikitext?.["*"];

    if (!wikitext) return defaultEntry;

    const lines = wikitext.split("\n");
    let eventIndex = 0;

    for (const rawLine of lines) {
      if (!rawLine.startsWith("*")) continue;
      const cleanLine = rawLine
        .replace(/^\*+\s*/, "")
        .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, "$1")
        .replace(/\{\{[^}]+\}\}/g, "")
        .trim();

      if (cleanLine.length < 15) continue;

      const wikiTitle = extractWikiTitle(rawLine);
      const lower = cleanLine.toLowerCase();
      eventIndex++;

      const isVN = VN_KEYWORDS.some((kw) => matchesKeyword(lower, kw));
      const isChina = !isVN && CHINA_KEYWORDS.some((kw) => matchesKeyword(lower, kw));

      const event: TimelineEvent = {
        id: `${year}-ev-${eventIndex}`,
        year,
        axis: isVN ? "vietnam" : isChina ? "china" : "world",
        title: cleanLine.split(/[-–:]/)[0].trim().slice(0, 80),
        description: cleanLine,
        wikiTitle,
        tag: isVN ? "Sử Việt" : isChina ? "Phương Bắc" : "Toàn cầu",
      };

      if (isVN) defaultEntry.vietnam.push(event);
      else if (isChina) defaultEntry.china.push(event);
      else defaultEntry.world.push(event);
    }

    return defaultEntry;
  } catch (err) {
    console.error(`Lỗi parse sự kiện năm ${year}:`, err);
    return defaultEntry;
  }
}

function getEraIdFromYear(year: number): string {
  if (year < 938) return "bac-thuoc";
  if (year <= 1858) return "quan-chu-doc-lap";
  if (year <= 1945) return "phap-thuoc-khang-chien";
  return "hien-dai";
}


// Lấy liên kết bài viết đầu tiên đủ ý nghĩa (bỏ qua năm, ngày tháng, không gian tên đặc biệt)
function extractWikiTitle(rawLine: string): string | undefined {
  const re = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rawLine))) {
    const title = m[1].trim();
    if (title.includes(":")) continue;
    if (/^\d+(\s*(TCN|BC))?$/i.test(title)) continue;
    if (/^\d{1,2}\s+tháng\s+\d{1,2}$/i.test(title)) continue;
    if (/^tháng\s+\d{1,2}$/i.test(title)) continue;
    return title;
  }
  return undefined;
}
