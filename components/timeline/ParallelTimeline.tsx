"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParallelTimelineEntry, HistoricalAxis } from "@/types/history";
import { Compass, BookOpen, Globe2, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface ParallelTimelineProps {
  entries: ParallelTimelineEntry[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export const ParallelTimeline: React.FC<ParallelTimelineProps> = ({
  entries,
  selectedYear,
  onSelectYear,
}) => {
  const [activeMobileTab, setActiveMobileTab] = useState<HistoricalAxis>("vietnam");

  const currentEntry = entries.find((e) => e.year === selectedYear) || entries[0];

  const axisMeta: Record<HistoricalAxis, { label: string; icon: any; colorClass: string; badge: string }> = {
    vietnam: {
      label: "Đại Việt / Việt Nam",
      icon: Compass,
      colorClass: "border-crimson text-crimson",
      badge: "bg-crimson/10 text-crimson border-crimson/20",
    },
    china: {
      label: "Phương Bắc / Trung Hoa",
      icon: BookOpen,
      colorClass: "border-bronze text-bronze-dark",
      badge: "bg-amber-800/10 text-amber-900 border-amber-800/20",
    },
    world: {
      label: "Thế giới / Toàn cầu",
      icon: Globe2,
      colorClass: "border-stone-500 text-stone-700",
      badge: "bg-stone-500/10 text-stone-700 border-stone-500/20",
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* 1. THANH ĐIỀU HƯỚNG MỐC NĂM (YEAR SELECTOR) */}
      <div className="mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-paper-800/70 block mb-2">
          Niên biểu đồng thời — Tam trục đối chiếu
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-paper-900 font-normal tracking-tight mb-6">
          Năm {selectedYear} {currentEntry?.label && `— ${currentEntry.label}`}
        </h2>

        {/* Nút chọn mốc năm dạng thẻ sách */}
        <div className="flex overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 mx-auto px-1">
          {entries.map((entry) => {
            const isSelected = entry.year === selectedYear;
            return (
              <button
                key={entry.year}
                onClick={() => onSelectYear(entry.year)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-serif transition-all duration-300 relative border ${
                  isSelected
                    ? "bg-paper-900 text-paper-50 border-paper-900 shadow-md scale-105"
                    : "bg-paper-100 text-paper-800 border-paper-300/60 hover:bg-paper-200/50"
                }`}
              >
                {entry.year}
                {isSelected && (
                  <motion.div
                    layoutId="activeYearIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-crimson"
                  />
                )}
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* 2. CHẾ ĐỘ MOBILE: TAB SWITCHER */}
      <div className="lg:hidden mb-6">
        <div className="grid grid-cols-3 p-1 bg-paper-100 rounded-xl border border-paper-300/50">
          {(["vietnam", "china", "world"] as HistoricalAxis[]).map((axis) => {
            const isActive = activeMobileTab === axis;
            const meta = axisMeta[axis];
            return (
              <button
                key={axis}
                onClick={() => setActiveMobileTab(axis)}
                className={`py-2 px-1 text-xs font-serif rounded-lg transition-all text-center flex flex-col items-center gap-1 ${
                  isActive
                    ? "bg-white text-paper-900 shadow-sm font-semibold"
                    : "text-paper-800/60 hover:text-paper-900"
                }`}
              >
                <span>{meta.label.split("/")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DESKTOP 3 COLUMNS & MOBILE ACTIVE TAB */}
      <div className="relative">
        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid grid-cols-3 gap-8 relative items-start">
          {/* CỘT 1: VIỆT NAM */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-crimson">
              <Compass className="w-5 h-5 text-crimson" />
              <h3 className="font-serif font-bold text-lg text-paper-900">Đại Việt / Việt Nam</h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`vn-${selectedYear}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {currentEntry.vietnam.length === 0 ? (
                  <EmptyState text="Chưa có dữ liệu ghi chép cho mốc năm này." />
                ) : (
                  currentEntry.vietnam.map((ev) => (
                    <EventCard key={ev.id} event={ev} badgeColor={axisMeta.vietnam.badge} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CỘT 2: TRUNG HOA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-bronze">
              <BookOpen className="w-5 h-5 text-bronze-dark" />
              <h3 className="font-serif font-bold text-lg text-paper-900">Phương Bắc / Trung Hoa</h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`cn-${selectedYear}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="space-y-4"
              >
                {currentEntry.china.length === 0 ? (
                  <EmptyState text="Không có biến cố nổi bật được ghi nhận." />
                ) : (
                  currentEntry.china.map((ev) => (
                    <EventCard key={ev.id} event={ev} badgeColor={axisMeta.china.badge} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CỘT 3: THẾ GIỚI */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-stone-500">
              <Globe2 className="w-5 h-5 text-stone-700" />
              <h3 className="font-serif font-bold text-lg text-paper-900">Thế giới đương thời</h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`world-${selectedYear}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-4"
              >
                {currentEntry.world.length === 0 ? (
                  <EmptyState text="Chưa có bản ghi tương ứng." />
                ) : (
                  currentEntry.world.map((ev) => (
                    <EventCard key={ev.id} event={ev} badgeColor={axisMeta.world.badge} />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE VIEW CONTENT */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeMobileTab}-${selectedYear}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {currentEntry[activeMobileTab].length === 0 ? (
                <EmptyState text="Chưa có dữ liệu cho luồng sự kiện này." />
              ) : (
                currentEntry[activeMobileTab].map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    badgeColor={axisMeta[activeMobileTab].badge}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface EventCardProps {
  event: any;
  badgeColor: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, badgeColor }) => {
  return (
    <article className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-paper-300/40 shadow-editorial transition-all hover:border-paper-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-sans px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
          {event.tag || "Sự kiện"}
        </span>
        <span className="text-xs font-mono text-paper-800/50">Năm {event.year}</span>
      </div>

      <h4 className="font-serif font-semibold text-base sm:text-lg text-paper-900 leading-snug mb-3 break-words">
        {event.title}
      </h4>

      <p className="text-sm font-serif text-paper-800/80 leading-relaxed mb-4 break-words">
        {event.description}
      </p>

      {event.wikiTitle ? (
        <Link
          href={`/read/${encodeURIComponent(event.wikiTitle)}`}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-crimson hover:text-crimson-deep transition-colors group"
        >
          <span>Đọc thêm</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </article>
  );
};

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="p-8 text-center bg-paper-100/50 rounded-2xl border border-dashed border-paper-300 text-sm font-serif italic text-paper-800/60">
    {text}
  </div>
);

