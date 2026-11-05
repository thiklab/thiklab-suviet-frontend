import { MAX_YEAR, MIN_YEAR } from "@/lib/constants/timeline-data";

// "Trận Bạch Đằng (1288)" -> "tran-bach-dang-1288"
export function slugify(input: string): string {
  return input
    .replace(/_/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const docHref = (title: string) => `/doc/${slugify(title) || "tu-lieu"}`;

// Link nội bộ kèm tiêu đề gốc để /doc/<slug> tra ngược chính xác (slug bỏ dấu, không đảo ngược được)
export const docLinkHref = (title: string) => `${docHref(title)}?t=${encodeURIComponent(title)}`;

export const yearToSlug = (year: number) => (year < 0 ? `${-year}-tcn` : String(year));

export const timelineHref = (year: number) => `/timeline/${yearToSlug(year)}`;

export function slugToYear(slug: string): number | null {
  const m = /^(\d{1,4})(-tcn)?$/.exec(slug);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const year = m[2] ? -n : n;
  if (n === 0 || year < MIN_YEAR || year > MAX_YEAR) return null;
  return year;
}
