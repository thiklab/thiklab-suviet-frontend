export type HistoricalAxis = "vietnam" | "china" | "world";

export interface WikiThumbnail {
  source: string;
  width: number;
  height: number;
}

export interface WikiSummary {
  title: string;
  displayTitle: string;
  extract: string;
  thumbnail?: WikiThumbnail;
  pageUrl: string;
  description?: string;
  timestamp?: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number; // 2 cho H2, 3 cho H3
}

export interface WikiArticle {
  title: string;
  displayTitle: string;
  cleanHtml: string;
  summary?: WikiSummary;
  toc: TOCItem[];
  originalUrl: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  axis: HistoricalAxis;
  title: string;
  description: string;
  wikiTitle?: string;
  tag?: string; // Ví dụ: "Quân sự", "Chính trị", "Văn hóa"
}

export interface ParallelTimelineEntry {
  year: number;
  label?: string; // Ví dụ: "Chiến thắng Bạch Đằng", "Cách mạng Tháng Tám"
  eraId: string;
  vietnam: TimelineEvent[];
  china: TimelineEvent[];
  world: TimelineEvent[];
}

export interface HistoricalEra {
  id: string;
  name: string;
  romanNumeral: string;
  timeRange: string;
  startYear: number;
  endYear: number;
  description: string;
  significance: string;
  featuredMilestones: number[];
}

