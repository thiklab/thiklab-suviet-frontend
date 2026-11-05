"use client";

import React, { useState, useEffect, useRef } from "react";
import { WikiArticle, WikiSummary } from "@/types/history";
import { ExternalLink, List, BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";

const stripHtmlTags = (html: string) => html.replace(/<[^>]*>/g, "").trim();

interface ReaderViewProps {
  article: WikiArticle;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ article }) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Popover Preview State
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    title: string;
    x: number;
    y: number;
    data: WikiSummary | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    title: "",
    x: 0,
    y: 0,
    data: null,
    isLoading: false,
  });

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTitleRef = useRef<string>("");
  const cacheRef = useRef<Map<string, WikiSummary | null>>(new Map());

  const cancelClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  const scheduleClose = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      currentTitleRef.current = "";
      setPreviewState((prev) => ({ ...prev, isOpen: false }));
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      cancelClose();
    };
  }, []);

  // 1. SCROLLSPY THEO DÕI VỊ TRÍ ĐỌC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    const headings = contentRef.current?.querySelectorAll("h2, h3");
    headings?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [article.cleanHtml]);

  // 2. SỰ KIỆN HOVER ĐỂ HIỂN THỊ WIKI POPUP PREVIEW
  const handleMouseOver = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest(".wiki-preview-link") as HTMLElement | null;
    if (!target) return;

    const title = target.getAttribute("data-wiki-title");
    if (!title) return;

    cancelClose();
    // Đang hiển thị/đang chờ đúng link này thì không làm lại
    if (currentTitleRef.current === title) return;
    currentTitleRef.current = title;

    const rect = target.getBoundingClientRect();
    const x = Math.max(16, Math.min(rect.left + window.scrollX, window.innerWidth - 340));
    const y = rect.bottom + window.scrollY;

    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    hoverTimerRef.current = setTimeout(async () => {
      const cached = cacheRef.current.get(title);
      if (cached !== undefined) {
        setPreviewState({ isOpen: true, title, x, y, data: cached, isLoading: false });
        return;
      }

      setPreviewState({ isOpen: true, title, x, y, data: null, isLoading: true });

      let data: WikiSummary | null = null;
      try {
        const res = await fetch(
          `https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`
        );
        if (res.ok) {
          const json = await res.json();
          data = {
            title: json.title,
            displayTitle: stripHtmlTags(json.titles?.display || json.title),
            extract: json.extract,
            thumbnail: json.thumbnail,
            pageUrl: json.content_urls?.desktop?.page,
            description: json.description,
          };
        }
      } catch {
        data = null;
      }

      cacheRef.current.set(title, data);
      if (currentTitleRef.current !== title) return;
      setPreviewState((prev) => ({ ...prev, data, isLoading: false }));
    }, 280);
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    // Di chuyển trong cùng một link hoặc sang popover thì không đóng
    if (related?.closest?.(".wiki-hover-popover")) return;
    const from = (e.target as HTMLElement).closest(".wiki-preview-link");
    if (from && related?.closest?.(".wiki-preview-link") === from) return;
    scheduleClose();
  };

  return (
    <div className="min-h-screen bg-paper-50 selection:bg-crimson/15 selection:text-crimson-deep relative pb-20">
      {/* HEADER BÀI VIẾT */}
      <header className="border-b border-paper-300/40 py-12 lg:py-16 bg-gradient-to-b from-paper-100/60 to-transparent">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/timeline"
            className="inline-flex items-center gap-1.5 text-xs font-sans text-paper-800/70 hover:text-crimson mb-6 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Quay lại Tam Trục Niên Biểu</span>
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-crimson font-medium mb-3 block">
            Tư liệu Lịch sử — Wikipedia Archive
          </span>
          <h1 className="text-3xl lg:text-5xl font-serif text-paper-900 tracking-tight leading-tight mb-4">
            {article.displayTitle}
          </h1>
          {article.summary?.description && (
            <p className="text-base lg:text-lg font-serif italic text-paper-800/70 max-w-2xl">
              "{article.summary.description}"
            </p>
          )}
        </div>
      </header>

      {/* THÂN BÀI VIẾT: GRID 12 CỘT */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* NỘI DUNG CHÍNH (8 CỘT) */}
          <main
            ref={contentRef}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            className="col-span-12 lg:col-span-8 bg-white/90 p-6 sm:p-10 lg:p-14 rounded-3xl border border-paper-300/40 shadow-editorial text-paper-900"
          >
            {/* Tóm tắt nhanh mở đầu */}
            {article.summary && (
              <div className="mb-10 p-6 bg-paper-50 rounded-2xl border-l-4 border-crimson">
                <p className="font-serif text-base text-paper-800 leading-relaxed italic">
                  {article.summary.extract}
                </p>
              </div>
            )}

            {/* Nội dung đã làm sạch */}
            <div
              className="prose-editorial"
              dangerouslySetInnerHTML={{ __html: article.cleanHtml }}
            />

            <div className="mt-16 pt-6 border-t border-paper-300/40 flex justify-between items-center text-xs text-paper-800/60 font-sans">
              <span>Nguồn: Wikipedia tiếng Việt</span>
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-crimson transition-colors"
              >
                <span>Xem bản gốc</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </main>

          {/* SIDEBAR MỤC LỤC CỐ ĐỊNH (4 CỘT) */}
          <aside className="hidden lg:block col-span-4 sticky top-24 space-y-6">
            <div className="bg-paper-100/70 p-6 rounded-2xl border border-paper-300/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 text-paper-900 font-serif font-bold text-sm">
                <List className="w-4 h-4 text-crimson" />
                <span>Mục lục văn bản</span>
              </div>

              <nav className="space-y-1 max-h-[65vh] overflow-y-auto pr-2 no-scrollbar">
                {article.toc.length === 0 && (
                  <p className="text-xs text-paper-800/50 font-serif italic">Không có mục phụ</p>
                )}
                {article.toc.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-xs font-serif leading-snug py-1.5 transition-colors ${
                        item.level === 3 ? "pl-4 text-paper-800/70" : "font-medium text-paper-900"
                      } ${
                        isActive
                          ? "text-crimson font-bold border-l-2 border-crimson pl-2"
                          : "hover:text-crimson"
                      }`}
                    >
                      {item.text}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      </div>

      {/* WIKI PREVIEW POPOVER TOOLTIP */}
      {previewState.isOpen && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          style={{ top: previewState.y, left: previewState.x }}
          className="wiki-hover-popover absolute z-50 w-80 bg-white rounded-2xl shadow-popover border border-paper-300 p-4 mt-2"
        >
          {previewState.isLoading ? (
            <div className="flex items-center justify-center py-6 gap-2 text-paper-800/50 text-xs font-sans">
              <div className="w-3.5 h-3.5 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
              <span>Đang tra cứu tư liệu...</span>
            </div>
          ) : previewState.data ? (
            <div>
              {previewState.data.thumbnail && (
                <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-paper-100">
                  <img
                    src={previewState.data.thumbnail.source}
                    alt={previewState.data.displayTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h5 className="font-serif font-bold text-sm text-paper-900 mb-1 leading-tight">
                {previewState.data.displayTitle}
              </h5>
              <p className="text-xs font-serif text-paper-800/80 line-clamp-3 mb-3 leading-relaxed">
                {previewState.data.extract || "Không có phần xem trước tóm tắt."}
              </p>
              <Link
                href={`/read/${encodeURIComponent(previewState.data.title)}`}
                className="block text-center text-xs font-sans py-1.5 px-3 bg-paper-100 hover:bg-crimson hover:text-white rounded-lg transition-colors font-medium text-paper-900"
              >
                Đọc bài chi tiết →
              </Link>
            </div>
          ) : (
            <p className="text-xs font-serif text-paper-800/60 text-center py-2">
              Không thể tải bản xem trước cho mục này.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

