import React from "react";
import Link from "next/link";
import { Compass, BookOpen, Clock, ChevronRight, Sparkles, Scroll } from "lucide-react";
import { HISTORICAL_ERAS } from "@/lib/constants/eras";

export default function HomePage() {
  const featuredYears = [
    { year: 938, label: "Đại thắng Bạch Đằng", desc: "Chấm dứt ngàn năm Bắc thuộc, mở kỷ nguyên độc lập" },
    { year: 1075, label: "Chiến dịch Ung Châu", desc: "Lý Thường Kiệt chủ động tiên phát chế nhân phá Tống" },
    { year: 1288, label: "Bạch Đằng Giang 1288", desc: "Đại thắng quân Nguyên Mông lần thứ 3" },
    { year: 1427, label: "Khởi nghĩa Lam Sơn", desc: "Đại thắng Chi Lăng - Xương Giang, Bình Ngô đại cáo" },
    { year: 1789, label: "Kỷ Dậu Đại Phá Quân Thanh", desc: "Vua Quang Trung hành quân thần tốc quét sạch 29 vạn quân" },
    { year: 1945, label: "Cách mạng Tháng Tám", desc: "Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa" },
  ];

  return (
    <main className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative py-20 lg:py-28 px-6 text-center border-b border-paper-300/40 bg-gradient-to-b from-paper-100/50 via-paper-50 to-paper-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson/10 border border-crimson/20 text-crimson text-xs font-sans tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khai phá Dữ liệu Mở Wikipedia theo Chuẩn Mới</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-paper-900 tracking-tight leading-[1.15]">
            Khám phá chiều sâu <br />
            <span className="italic text-crimson font-normal">Sử Việt ngàn năm</span>
          </h1>

          <p className="text-base sm:text-xl font-serif text-paper-800/80 max-w-2xl mx-auto leading-relaxed">
            "Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam." Trải nghiệm đối chiếu tam trục lịch sử và không gian đọc tĩnh lặng, tinh gọn.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/timeline"
              className="px-6 py-3.5 rounded-full bg-paper-900 text-paper-50 font-serif text-sm hover:bg-crimson transition-all shadow-md flex items-center gap-2 group"
            >
              <Clock className="w-4 h-4" />
              <span>Khám phá Tam Trục Niên Biểu</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/pathways"
              className="px-6 py-3.5 rounded-full bg-paper-100 border border-paper-300 text-paper-900 font-serif text-sm hover:bg-paper-200 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-paper-800/70" />
              <span>Lộ trình 5 Thời kỳ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MỐC NĂM ĐỐI CHIẾU NỔI BẬT */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-crimson block mb-2">
              Niên biểu trọng điểm
            </span>
            <h2 className="text-3xl font-serif text-paper-900 font-normal">
              Các Mốc Năm Bản Lề Lịch Sử
            </h2>
          </div>
          <Link
            href="/timeline"
            className="text-xs font-sans font-medium text-crimson hover:underline flex items-center gap-1"
          >
            <span>Mở toàn bộ dòng thời gian</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredYears.map((item) => (
            <Link
              key={item.year}
              href={`/timeline?year=${item.year}`}
              className="group p-6 rounded-2xl bg-white/80 border border-paper-300/40 shadow-editorial hover:shadow-lg hover:border-paper-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-serif font-bold text-paper-900 group-hover:text-crimson transition-colors">
                    {item.year}
                  </span>
                  <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-paper-100 text-paper-800 border border-paper-300/50">
                    Đối chiếu 3 trục
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-lg text-paper-900 mb-2">
                  {item.label}
                </h3>
                <p className="text-xs font-serif text-paper-800/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-paper-100 flex items-center justify-between text-xs font-sans text-paper-800/60 group-hover:text-crimson transition-colors">
                <span>So sánh với Trung Quốc & Thế giới</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. NĂM THỜI KỲ TRỌNG TÂM */}
      <section className="py-16 px-6 bg-paper-100/40 border-t border-paper-300/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-crimson block mb-2">
              Lộ trình lịch sử
            </span>
            <h2 className="text-3xl font-serif text-paper-900 font-normal">
              Trục Thời Kỳ Phát Triển Dân Tộc
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {HISTORICAL_ERAS.map((era) => (
              <div
                key={era.id}
                className="p-5 rounded-2xl bg-white/70 border border-paper-300/40 shadow-editorial flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-serif font-bold text-crimson mb-2">
                    Kỷ nguyên {era.romanNumeral}
                  </div>
                  <h3 className="font-serif font-bold text-base text-paper-900 mb-1 leading-snug">
                    {era.name}
                  </h3>
                  <p className="text-[11px] font-mono text-paper-800/60 mb-3">
                    {era.timeRange}
                  </p>
                  <p className="text-xs font-serif text-paper-800/80 line-clamp-3 leading-relaxed">
                    {era.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-paper-100">
                  <Link
                    href={`/pathways#${era.id}`}
                    className="text-[11px] font-sans font-medium text-crimson hover:underline flex items-center justify-between"
                  >
                    <span>Xem chi tiết</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

