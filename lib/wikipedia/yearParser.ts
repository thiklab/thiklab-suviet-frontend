import { ParallelTimelineEntry, TimelineEvent } from "@/types/history";
import { CURATED_MILESTONES } from "@/lib/constants/milestones";

const VN_KEYWORDS = [
  "đại việt", "việt nam", "an nam", "thăng long", "quân nguyên", "nhà trần",
  "trần hưng đạo", "nguyễn huệ", "quang trung", "quân thanh", "nhà lê",
  "nhà lý", "ngô quyền", "bạch đằng", "hồ chí minh", "hà nội", "sài gòn", "huế",
  "gia long", "minh mạng", "vua", "khởi nghĩa", "đinh bộ lĩnh", "hoa lư"
];

const CHINA_KEYWORDS = [
  "trung quốc", "nhà thanh", "nhà minh", "nhà nguyên", "nhà tống", "nhà đường",
  "bắc kinh", "nam kinh", "hoàng đế", "càn long", "hốt tất liệt", "tử cấm thành",
  "hán", "tam quốc", "tào tháo", "lưu bị", "tùy", "mãn thanh"
];

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
      { next: { revalidate: 86400 * 7 } }
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

      const lower = cleanLine.toLowerCase();
      eventIndex++;

      const isVN = VN_KEYWORDS.some((kw) => lower.includes(kw));
      const isChina = !isVN && CHINA_KEYWORDS.some((kw) => lower.includes(kw));

      const event: TimelineEvent = {
        id: `${year}-ev-${eventIndex}`,
        year,
        axis: isVN ? "vietnam" : isChina ? "china" : "world",
        title: cleanLine.split(/[-–:]/)[0].trim().slice(0, 80),
        description: cleanLine,
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

