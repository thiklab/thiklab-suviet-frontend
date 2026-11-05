import { CURATED_MILESTONES } from "@/lib/constants/milestones";
import { EVENTS, formatYear, regimeAt } from "@/lib/constants/timeline-data";
import { fitDescription, truncate } from "./text";
import { yearToSlug } from "./slug";

export function yearHeadline(year: number): string | null {
  const curated = CURATED_MILESTONES[year]?.label;
  if (curated) return curated.split(" - ")[0].trim();
  return EVENTS.find((e) => e[0] === "vn" && e[1] === year)?.[2] ?? null;
}

const yearLabel = (year: number) => (year < 0 ? `năm ${-year} TCN` : `năm ${year}`);

export function yearTitle(year: number): string {
  const headline = yearHeadline(year);
  const withYear = headline && !headline.includes(String(Math.abs(year))) ? `${headline} (${formatYear(year)})` : headline;
  if (withYear && withYear.length <= 40) return withYear;
  return `Sự kiện lịch sử ${yearLabel(year)}`;
}

export function regimeSummary(year: number) {
  return {
    vn: regimeAt("vn", year).current[1],
    cn: regimeAt("cn", year).current[1],
    wd: regimeAt("wd", year).current[1],
  };
}

export function yearDescription(year: number): string {
  const r = regimeSummary(year);
  const headline = yearHeadline(year);
  const lead = headline ? `${headline}. ` : "";
  const base = `${lead}Đối chiếu ${yearLabel(year)}: Việt Nam thời ${r.vn}, Trung Quốc thời ${r.cn}, thế giới giai đoạn ${r.wd}.`;
  return fitDescription(base, "Kèm nội dung mở từ Wikipedia tiếng Việt và các mốc năm liên quan.");
}

export const yearPath = (year: number) => `/timeline/${yearToSlug(year)}`;

export const shortText = (s: string, n: number) => truncate(s, n);
