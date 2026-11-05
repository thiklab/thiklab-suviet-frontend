import { cache } from "react";
import { cached } from "@/lib/cache/redis";
import { fetchYearParallelEvents } from "@/lib/wikipedia/yearParser";
import type { ParallelTimelineEntry } from "@/types/history";

const TTL_SECONDS = 60 * 60 * 24 * 7;

// Wikipedia chỉ có dữ liệu sự kiện theo năm cho năm dương lịch từ 1 trở đi
export const hasWikiYear = (year: number) => year >= 1 && year <= 2026;

export const getYearEntry = cache(async (year: number): Promise<ParallelTimelineEntry | null> => {
  if (!hasWikiYear(year)) return null;
  return cached(`suviet:year:v1:${year}`, TTL_SECONDS, () => fetchYearParallelEvents(year));
});
