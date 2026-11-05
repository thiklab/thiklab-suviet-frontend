import Link from "next/link";
import { CURATED_MILESTONES } from "@/lib/constants/milestones";
import { EVENTS, formatYear } from "@/lib/constants/timeline-data";
import { docHref, timelineHref } from "@/lib/seo/slug";
import { eraOfYear, neighborYears } from "@/lib/seo/years";
import { regimeSummary, yearHeadline } from "@/lib/seo/yearMeta";
import type { ParallelTimelineEntry } from "@/types/history";

interface Props {
  year: number;
  wiki: ParallelTimelineEntry | null;
}

const wikiYearUrl = (year: number) =>
  year > 0 ? `https://vi.wikipedia.org/wiki/${year}` : `https://vi.wikipedia.org/wiki/${-year}_TCN`;

export function YearEditorial({ year, wiki }: Props) {
  const r = regimeSummary(year);
  const era = eraOfYear(year);
  const headline = yearHeadline(year);
  const curated = CURATED_MILESTONES[year];
  const neighbors = neighborYears(year, 2);
  const nearby = EVENTS.filter((e) => e[1] !== year && Math.abs(e[1] - year) <= 60)
    .sort((a, b) => Math.abs(a[1] - year) - Math.abs(b[1] - year))
    .slice(0, 6);

  return (
    <section className="tl-editorial" aria-labelledby="year-context">
      <h2 id="year-context">Bối cảnh năm {formatYear(year)}</h2>
      <p>
        {headline ? `${headline}. ` : ""}
        Vào năm {formatYear(year)}, Việt Nam đang ở giai đoạn <strong>{r.vn}</strong>, trong khi Trung Quốc thuộc giai đoạn{" "}
        <strong>{r.cn}</strong> và thế giới đang trải qua <strong>{r.wd}</strong>. Mốc năm này nằm trong giai đoạn{" "}
        <Link prefetch={false} href={`/pathways#${era.id}`}>{era.name}</Link> của lịch sử Việt Nam ({era.timeRange}).
      </p>

      {curated && (
        <>
          <h3>Tìm hiểu thêm: {curated.label}</h3>
          {[...curated.vietnam, ...curated.china, ...curated.world].map((ev) => (
            <p key={ev.id}>
              <strong>{ev.title}.</strong> {ev.description}{" "}
              {ev.wikiTitle && (
                <Link prefetch={false} href={docHref(ev.wikiTitle)}>
                  Đọc bài {ev.wikiTitle}
                </Link>
              )}
            </p>
          ))}
        </>
      )}

      {nearby.length > 0 && (
        <>
          <h3>Sự kiện gần năm {formatYear(year)}</h3>
          <ul>
            {nearby.map((e) => (
              <li key={`${e[0]}-${e[1]}-${e[2]}`}>
                <Link prefetch={false} href={timelineHref(e[1])}>
                  <time dateTime={e[1] > 0 ? String(e[1]).padStart(4, "0") : undefined}>{formatYear(e[1])}</time>: {e[2]}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <nav aria-label="Các mốc năm liên quan">
        <h3>Các mốc năm liên quan</h3>
        <ul>
          {neighbors.map((y) => (
            <li key={y}>
              <Link prefetch={false} href={timelineHref(y)}>So sánh lịch sử năm {formatYear(y)}</Link>
            </li>
          ))}
          <li>
            <Link prefetch={false} href={`/pathways#${era.id}`}>Tổng quan giai đoạn {era.name}</Link>
          </li>
        </ul>
      </nav>

      {wiki && (wiki.vietnam.length + wiki.china.length + wiki.world.length > 0) && (
        <p className="tl-attrib">
          Một phần dữ liệu sự kiện lấy từ bài{" "}
          <a href={wikiYearUrl(year)} target="_blank" rel="noopener noreferrer">
            “{year > 0 ? year : `${-year} TCN`}” trên Wikipedia tiếng Việt
          </a>
          , theo giấy phép{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.vi" target="_blank" rel="noopener noreferrer">
            CC BY-SA 4.0
          </a>
          .
        </p>
      )}
    </section>
  );
}
