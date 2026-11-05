"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ParallelTimeline } from "@/components/timeline/ParallelTimeline";
import { CURATED_MILESTONES } from "@/lib/constants/milestones";
import { fetchYearParallelEvents } from "@/lib/wikipedia/yearParser";
import { ParallelTimelineEntry } from "@/types/history";
import { Search, Loader2 } from "lucide-react";

export default function TimelinePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper-50 text-paper-800/60">
          <Loader2 className="h-5 w-5 animate-spin text-crimson" />
        </div>
      }
    >
      <TimelineContent />
    </Suspense>
  );
}

function TimelineContent() {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");

  const initialYear = yearParam ? parseInt(yearParam, 10) : 1288;
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [entriesMap, setEntriesMap] = useState<Record<number, ParallelTimelineEntry>>(CURATED_MILESTONES);
  const [customYearInput, setCustomYearInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Danh sách các mốc năm mặc định
  const availableYears = Object.keys(entriesMap).map(Number).sort((a, b) => a - b);

  useEffect(() => {
    if (yearParam) {
      const yr = parseInt(yearParam, 10);
      if (!isNaN(yr)) {
        handleSelectYear(yr);
      }
    }
  }, [yearParam]);

  const handleSelectYear = async (year: number) => {
    setSelectedYear(year);

    // Nếu chưa có trong Map, fetch từ Wikipedia API
    if (!entriesMap[year]) {
      setIsLoading(true);
      try {
        const entry = await fetchYearParallelEvents(year);
        setEntriesMap((prev) => ({ ...prev, [year]: entry }));
      } catch (err) {
        console.error("Lỗi khi tải mốc năm:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCustomYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yr = parseInt(customYearInput.trim(), 10);
    if (!isNaN(yr) && yr > 0 && yr <= 2026) {
      handleSelectYear(yr);
      setCustomYearInput("");
    }
  };

  const allEntries = availableYears.map((yr) => entriesMap[yr]);

  return (
    <div className="min-h-screen py-10 bg-paper-50">
      {/* Ô tìm kiếm / tra cứu năm bất kỳ */}
      <div className="max-w-xl mx-auto px-4 mb-4">
        <form onSubmit={handleCustomYearSubmit} className="relative flex items-center">
          <input
            type="number"
            min="1"
            max="2026"
            value={customYearInput}
            onChange={(e) => setCustomYearInput(e.target.value)}
            placeholder="Tra cứu mốc năm bất kỳ (ví dụ: 1911, 1954, 1802)..."
            className="w-full px-5 py-3 pr-24 rounded-full bg-white border border-paper-300 text-sm font-serif placeholder:text-paper-800/40 focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !customYearInput.trim()}
            className="absolute right-1.5 px-4 py-2 bg-crimson hover:bg-crimson-deep disabled:opacity-40 text-white rounded-full text-xs font-sans font-medium transition-colors flex items-center gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Tra cứu</span>
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="py-6 flex justify-center items-center gap-2 text-xs font-sans text-paper-800/60">
          <Loader2 className="w-4 h-4 animate-spin text-crimson" />
          <span>Đang truy vấn và bóc tách dữ liệu năm {selectedYear} từ Wikipedia...</span>
        </div>
      )}

      {/* Component ParallelTimeline 3 trục */}
      <ParallelTimeline
        entries={allEntries}
        selectedYear={selectedYear}
        onSelectYear={handleSelectYear}
      />
    </div>
  );
}
