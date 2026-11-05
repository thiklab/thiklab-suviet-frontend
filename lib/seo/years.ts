import { CURATED_MILESTONES } from "@/lib/constants/milestones";
import { HISTORICAL_ERAS } from "@/lib/constants/eras";
import { EVENTS, KEY_YEARS, MAX_YEAR, MIN_YEAR } from "@/lib/constants/timeline-data";

// Các mốc năm được dựng sẵn và đưa vào sitemap
export const INDEXED_YEARS: number[] = Array.from(
  new Set<number>([
    ...KEY_YEARS,
    ...EVENTS.map((e) => e[1]),
    ...Object.keys(CURATED_MILESTONES).map(Number),
    ...HISTORICAL_ERAS.flatMap((era) => era.featuredMilestones),
  ])
)
  .filter((y) => y !== 0 && y >= MIN_YEAR && y <= MAX_YEAR)
  .sort((a, b) => a - b);

export function neighborYears(year: number, each = 2): number[] {
  const others = INDEXED_YEARS.filter((y) => y !== year);
  const before = others.filter((y) => y < year).slice(-each);
  const after = others.filter((y) => y > year).slice(0, each);
  return [...before, ...after];
}

export function eraOfYear(year: number) {
  return (
    HISTORICAL_ERAS.find((e) => year >= e.startYear && year < e.endYear) ??
    HISTORICAL_ERAS[HISTORICAL_ERAS.length - 1]
  );
}
