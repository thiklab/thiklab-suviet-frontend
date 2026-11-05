"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ParallelTimelineEntry, TimelineEvent } from "@/types/history";
import {
  ANCHORS,
  ERAS,
  EVENTS,
  KEY_YEARS,
  LANE_NAMES,
  LANE_SHORT,
  MAX_YEAR,
  MIN_YEAR,
  REGIMES,
  STEPS,
  WINDOWS,
  Lane,
  formatYear,
  posToYear,
  regimeAt,
  yearToPos,
} from "@/lib/constants/timeline-data";
import { docHref, timelineHref } from "@/lib/seo/slug";

const LANES: Lane[] = ["vn", "cn", "wd"];
const clampYear = (y: number) => Math.max(MIN_YEAR, Math.min(MAX_YEAR, Math.round(y)));

interface Props {
  initialYear: number;
  initialWiki?: ParallelTimelineEntry | null;
  children?: React.ReactNode;
}

export const TimelineExplorer: React.FC<Props> = ({ initialYear, initialWiki, children }) => {
  const [year, setYear] = useState<number>(clampYear(initialYear));
  const [win, setWin] = useState<number>(50);
  const [wikiEntry, setWikiEntry] = useState<ParallelTimelineEntry | null>(
    initialWiki && initialWiki.year === clampYear(initialYear) ? initialWiki : null
  );
  const [wikiLoading, setWikiLoading] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const wikiCache = useRef<Map<number, ParallelTimelineEntry | null>>(new Map());
  if (initialWiki) wikiCache.current.set(initialWiki.year, initialWiki);

  const select = useCallback((y: number) => {
    const next = clampYear(y);
    setYear(next);
    window.history.replaceState(null, "", timelineHref(next));
  }, []);

  useEffect(() => {
    setYear(clampYear(initialYear));
  }, [initialYear]);

  // Dữ liệu động từ Wikipedia cho đúng năm đang chọn (chỉ năm công nguyên), có debounce khi kéo thước
  useEffect(() => {
    if (year <= 0) {
      setWikiEntry(null);
      setWikiLoading(false);
      return;
    }
    if (wikiCache.current.has(year)) {
      setWikiEntry(wikiCache.current.get(year) ?? null);
      setWikiLoading(false);
      return;
    }

    setWikiEntry(null);
    setWikiLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/timeline?year=${year}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ParallelTimelineEntry = await res.json();
        wikiCache.current.set(year, data);
        setWikiEntry(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        wikiCache.current.set(year, null);
      }
      setWikiLoading(false);
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [year]);

  const era = useMemo(() => [...ERAS].reverse().find((e) => e[1] <= year) ?? ERAS[0], [year]);

  const moveFromPointer = (clientX: number) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;
    select(posToYear(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const m = ({ ArrowLeft: -1, ArrowRight: 1, PageDown: -50, PageUp: 50 } as Record<string, number>)[e.key];
    if (m) {
      e.preventDefault();
      select(year + (e.shiftKey ? 10 * m : m));
    }
  };

  return (
    <div className="tl-root">
      <header className="tl-header">
        <h1>Dòng thời gian năm {formatYear(year)}</h1>
        <p>Chọn một mốc năm — xem Việt Nam, Trung Quốc và Thế giới đang ở đâu cùng lúc.</p>
      </header>

      <section className="tl-stage" aria-label="Thanh thời gian">
        <div className="tl-in">
          <div className="tl-row">
            <div className="tl-year">
              {year > 0 ? <time dateTime={String(year).padStart(4, "0")}>{formatYear(year)}</time> : formatYear(year)}
              <small>{era[0]}</small>
            </div>
            <div className="tl-steps">
              {STEPS.map(([d, label]) => (
                <button key={label} type="button" onClick={() => select(year + d)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={rulerRef}
            className="tl-ruler"
            tabIndex={0}
            role="slider"
            aria-label="Năm"
            aria-valuemin={MIN_YEAR}
            aria-valuemax={MAX_YEAR}
            aria-valuenow={year}
            aria-valuetext={formatYear(year)}
            onKeyDown={onKeyDown}
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              moveFromPointer(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && moveFromPointer(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <div className="tl-eras">
              {ERAS.map((e, i) => {
                const next = ERAS[i + 1] ? ERAS[i + 1][1] : MAX_YEAR;
                return (
                  <span
                    key={e[0]}
                    style={{ width: `${(yearToPos(next) - yearToPos(e[1])) * 100}%` }}
                    title={`${e[0]}: ${formatYear(e[1])} – ${next === MAX_YEAR ? "nay" : formatYear(next)}`}
                  >
                    {e[0]}
                  </span>
                );
              })}
              {KEY_YEARS.map((k) => (
                <div key={k} className="tl-tick" style={{ left: `${yearToPos(k) * 100}%` }} />
              ))}
            </div>

            {LANES.map((lane) => (
              <div key={lane} className={`tl-lane ${lane}`}>
                <span className="tl-tag">{LANE_SHORT[lane]}</span>
                {REGIMES[lane].map((r, i, arr) => {
                  const next = arr[i + 1] ? arr[i + 1][0] : MAX_YEAR;
                  return (
                    <i
                      key={r[1]}
                      style={{
                        left: `${yearToPos(r[0]) * 100}%`,
                        width: `${(yearToPos(next) - yearToPos(r[0])) * 100}%`,
                      }}
                      title={`${r[1]} (${formatYear(r[0])} – ${arr[i + 1] ? formatYear(next) : "nay"})`}
                    >
                      {r[1]}
                    </i>
                  );
                })}
              </div>
            ))}

            <div className="tl-ph" style={{ left: `calc(${yearToPos(year) * 100}% - 1px)` }} />
          </div>

          <div className="tl-ctl">
            <span>Biên độ:</span>
            {WINDOWS.map((w) => (
              <button
                key={w}
                type="button"
                className={`tl-chip ${win === w ? "on" : ""}`}
                onClick={() => setWin(w)}
              >
                ±{w}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="tl-main">
        <div className="tl-grid">
          {LANES.map((lane) => (
            <LaneCard
              key={lane}
              lane={lane}
              year={year}
              win={win}
              wikiEvents={wikiEntry ? wikiEntry[lane === "vn" ? "vietnam" : lane === "cn" ? "china" : "world"] : []}
              wikiLoading={wikiLoading}
              onSelect={select}
            />
          ))}
        </div>

        {children}

        <div className="tl-key">
          <h2>Mốc quan trọng — bấm để so sánh</h2>
          <div className="tl-keys">
            {KEY_YEARS.map((k) => (
              <Link prefetch={false}
                key={k}
                href={timelineHref(k)}
                scroll
                className={`tl-chip ${k === year ? "on" : ""}`}
                aria-current={k === year ? "page" : undefined}
              >
                {formatYear(k)}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="tl-footer">
        Các mốc năm thời xa xưa mang tính truyền thống và ước chừng. Thanh thời gian chia theo 5 giai đoạn của Việt Nam, không
        theo tỷ lệ tuyến tính.
      </footer>
    </div>
  );
};

interface LaneCardProps {
  lane: Lane;
  year: number;
  win: number;
  wikiEvents: TimelineEvent[];
  wikiLoading: boolean;
  onSelect: (y: number) => void;
}

const LaneCard: React.FC<LaneCardProps> = ({ lane, year, win, wikiEvents, wikiLoading, onSelect }) => {
  const { current, nextStart } = regimeAt(lane, year);

  const { events, near } = useMemo(() => {
    const all = EVENTS.filter((e) => e[0] === lane);
    const inRange = all.filter((e) => Math.abs(e[1] - year) <= win).sort((a, b) => a[1] - b[1]);
    if (inRange.length) return { events: inRange, near: false };
    const nearest = [...all].sort((a, b) => Math.abs(a[1] - year) - Math.abs(b[1] - year))[0];
    return { events: nearest ? [nearest] : [], near: true };
  }, [lane, year, win]);

  const hasWiki = wikiEvents.length > 0;

  return (
    <div className={`tl-card ${lane}`}>
      <div className="tl-lab">{LANE_NAMES[lane]}</div>
      <div className="tl-reg">{current[1]}</div>
      <div className="tl-rng">
        {formatYear(current[0])} – {nextStart !== null ? formatYear(nextStart) : "nay"}
      </div>

      {near && events.length > 0 && <div className="tl-none">Không có sự kiện trong ±{win} năm. Gần nhất:</div>}
      {events.map((e) => {
        const d = e[1] - year;
        const rel = d === 0 ? "đúng năm này" : `${d > 0 ? "sau" : "trước"} ${Math.abs(d)} năm`;
        return (
          <div key={`${e[1]}-${e[2]}`} className={`tl-ev ${d === 0 ? "now" : ""}`}>
            <button type="button" onClick={() => onSelect(e[1])}>
              <b>{e[2]}</b>
              <em>
                {formatYear(e[1])} · {rel}
              </em>
            </button>
            <Link prefetch={false} className="tl-more" href={docHref(e[3])}>
              Đọc thêm<span className="sr-only"> về {e[2]}</span> →
            </Link>
          </div>
        );
      })}

      {hasWiki && (
        <div className="tl-wiki">
          <div className="tl-wiki-label">Từ Wikipedia · năm {formatYear(year)}</div>
          {wikiEvents.map((ev) => (
            <div key={ev.id} className="tl-ev">
              <p>{ev.description}</p>
              <Link prefetch={false} className="tl-more" href={docHref(ev.wikiTitle || ev.title)}>
                Đọc thêm<span className="sr-only"> về {ev.title}</span> →
              </Link>
            </div>
          ))}
        </div>
      )}
      {!hasWiki && wikiLoading && <div className="tl-none">Đang tải dữ liệu Wikipedia…</div>}
    </div>
  );
};
