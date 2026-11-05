import React from "react";
import Link from "next/link";
import { HISTORICAL_ERAS } from "@/lib/constants/eras";
import { Icon } from "@/components/common/Icon";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/meta";
import { timelineHref } from "@/lib/seo/slug";

export const metadata: Metadata = buildMetadata({
  title: "5 giai đoạn lịch sử Việt Nam: từ Hồng Bàng đến hiện đại",
  description:
    "5 giai đoạn lịch sử Việt Nam từ Hồng Bàng, Bắc thuộc, quân chủ độc lập, Pháp thuộc đến hiện đại, kèm các mốc năm tiêu biểu để so sánh.",
  path: "/pathways",
});

export default function PathwaysPage() {
  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 max-w-8xl mx-auto">
      <JsonLd
        data={breadcrumbLd([
          { name: "Trang chủ", path: "/" },
          { name: "Các giai đoạn lịch sử", path: "/pathways" },
        ])}
      />
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-crimson block mb-2">
          Hệ thống hóa Tiến trình Dân tộc
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-paper-900 tracking-tight mb-4">
          5 Giai Đoạn Lịch Sử Việt Nam
        </h1>
        <p className="text-base font-serif text-paper-800/80 leading-relaxed">
          Theo dõi hành trình lập quốc, đấu tranh sinh tồn, khẳng định chủ quyền và phát triển hội nhập của nước Việt qua từng giai đoạn then chốt.
        </p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-paper-300/60 hidden md:block">
        {HISTORICAL_ERAS.map((era) => (
          <div key={era.id} id={era.id} className="relative pl-20 group">
            {/* Điểm nút trên trục */}
            <div className="absolute left-6 -translate-x-1/2 top-4 w-5 h-5 rounded-full bg-paper-50 border-4 border-crimson transition-transform group-hover:scale-125" />

            <div className="bg-white/90 p-8 rounded-3xl border border-paper-300/40 shadow-editorial transition-all hover:border-paper-300 hover:shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-crimson/10 text-crimson font-medium">
                  Giai đoạn {era.romanNumeral}
                </span>
                <span className="text-xs font-mono text-paper-800/60 font-semibold">
                  {era.timeRange}
                </span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-paper-900 mb-3">
                {era.name}
              </h2>

              <p className="font-serif text-paper-800/85 leading-relaxed mb-4 text-base">
                {era.description}
              </p>

              <div className="p-4 rounded-xl bg-paper-100/60 border border-paper-200 mb-6">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-paper-900 mb-1">
                  <Icon name="bookmark" className="w-3.5 h-3.5 text-crimson" />
                  <span>Ý nghĩa lịch sử cốt lõi:</span>
                </div>
                <p className="text-xs font-serif text-paper-800/80 leading-relaxed">
                  {era.significance}
                </p>
              </div>

              {/* Các mốc năm nổi bật của kỷ nguyên */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-xs font-sans text-paper-800/60">Mốc năm tiêu biểu:</span>
                {era.featuredMilestones.map((yr) => (
                  <Link prefetch={false}
                    key={yr}
                    href={timelineHref(yr)}
                    aria-label={`So sánh lịch sử năm ${yr > 0 ? yr : `${-yr} TCN`}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-paper-50 border border-paper-300 text-xs font-mono text-paper-900 hover:border-crimson hover:text-crimson transition-colors"
                  >
                    <span>{yr > 0 ? yr : `${Math.abs(yr)} TCN`}</span>
                    <Icon name="chevron-right" className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Giao diện Mobile */}
      <div className="md:hidden space-y-6">
        {HISTORICAL_ERAS.map((era) => (
          <div key={era.id} id={era.id} className="bg-white/90 p-6 rounded-2xl border border-paper-300/40 shadow-editorial">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-crimson font-bold">Giai đoạn {era.romanNumeral}</span>
              <span className="text-[11px] font-mono text-paper-800/60">{era.timeRange}</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-paper-900 mb-2">{era.name}</h2>
            <p className="text-xs font-serif text-paper-800/80 mb-4 leading-relaxed">{era.description}</p>
            <div className="p-3 bg-paper-100/60 rounded-xl mb-4 text-xs font-serif text-paper-800/80">
              <strong className="text-paper-900 block mb-0.5">Ý nghĩa:</strong>
              {era.significance}
            </div>
            <div className="flex flex-wrap gap-2">
              {era.featuredMilestones.map((yr) => (
                <Link prefetch={false}
                  key={yr}
                  href={timelineHref(yr)}
                    aria-label={`So sánh lịch sử năm ${yr > 0 ? yr : `${-yr} TCN`}`}
                  className="px-2.5 py-1 rounded-full bg-paper-50 border border-paper-300 text-[11px] font-mono text-paper-900"
                >
                  {yr > 0 ? yr : `${Math.abs(yr)} TCN`}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

