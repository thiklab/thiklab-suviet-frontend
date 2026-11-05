import React from "react";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import type { Metadata } from "next";
import { HISTORICAL_ERAS } from "@/lib/constants/eras";
import { buildMetadata } from "@/lib/seo/meta";
import { timelineHref } from "@/lib/seo/slug";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Lịch sử Việt Nam so sánh với Trung Quốc và thế giới",
    description:
      "Khám phá lịch sử Việt Nam ngàn năm qua dòng thời gian so sánh với Trung Quốc và thế giới, kèm nội dung mở từ Wikipedia tiếng Việt cho từng mốc năm.",
    path: "/",
  }),
  title: { absolute: "Sử Việt Niên Biểu — Lịch sử Việt Nam so sánh với thế giới" },
};

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
      <section className="relative py-14 sm:py-20 lg:py-28 px-4 sm:px-6 text-center border-b border-paper-300/40 bg-gradient-to-b from-paper-100/50 via-paper-50 to-paper-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson/10 border border-crimson/20 text-crimson text-xs font-sans tracking-wide">
            <Icon name="sparkles" className="w-3.5 h-3.5" />
            <span>Khai phá Dữ liệu Mở Wikipedia theo Chuẩn Mới</span>
          </div>

          <h1 className="text-3xl min-[400px]:text-4xl sm:text-6xl lg:text-7xl font-serif text-paper-900 tracking-tight leading-[1.15]">
            Khám phá chiều sâu <br />
            <span className="italic text-crimson font-normal">Sử Việt ngàn năm</span>
          </h1>

          <p className="text-base sm:text-xl font-serif text-paper-800/80 max-w-2xl mx-auto leading-relaxed">
            "Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."
            <br />
            Trải nghiệm so sánh lịch sử Việt Nam – Trung Quốc – Thế giới và không gian đọc tĩnh lặng, tinh gọn.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link prefetch={false}
              href="/timeline"
              className="px-6 py-3.5 rounded-full bg-paper-900 text-paper-50 font-serif text-sm hover:bg-crimson transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <Icon name="clock" className="w-4 h-4" />
              <span>Xem dòng thời gian</span>
              <Icon name="chevron-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link prefetch={false}
              href="/pathways"
              className="px-6 py-3.5 rounded-full bg-paper-100 border border-paper-300 text-paper-900 font-serif text-sm hover:bg-paper-200 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="compass" className="w-4 h-4 text-paper-800/70" />
              <span>5 giai đoạn lịch sử</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Đoạn giới thiệu cho người đọc và công cụ tìm kiếm */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 max-w-3xl mx-auto" aria-labelledby="gioi-thieu">
        <h2 id="gioi-thieu" className="text-2xl font-serif text-paper-900 mb-4">
          Sử Việt Niên Biểu dùng để làm gì?
        </h2>
        <p className="font-serif text-paper-800/90 leading-relaxed">
          Sử Việt Niên Biểu là công cụ đọc và tra cứu lịch sử Việt Nam theo từng mốc năm. Thay vì xem một sự kiện đứng riêng lẻ,
          bạn có thể đặt nó cạnh bối cảnh Trung Quốc và thế giới cùng thời điểm: chiến thắng Bạch Đằng năm 938 diễn ra khi Trung
          Hoa đang ở thời Ngũ đại Thập quốc; cuộc kháng chiến chống Nguyên Mông thế kỷ XIII gắn với sự trỗi dậy của đế quốc Mông Cổ.
          Mỗi mốc năm có phần so sánh Việt Nam, Trung Quốc và thế giới, danh sách sự kiện liên quan và liên kết sang bài viết chi tiết từ Wikipedia tiếng
          Việt, được làm sạch để đọc thoải mái. Hãy bắt đầu từ <Link prefetch={false} className="text-crimson underline" href={timelineHref(938)}>dòng thời gian năm 938</Link>{" "}
          hoặc theo dõi <Link prefetch={false} className="text-crimson underline" href="/pathways">5 giai đoạn lớn của lịch sử Việt Nam</Link>.
        </p>
      </section>

      {/* 2. MỐC NĂM ĐỐI CHIẾU NỔI BẬT */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-crimson block mb-2">
              Dòng thời gian
            </span>
            <h2 className="text-3xl font-serif text-paper-900 font-normal">
              Các Mốc Năm Quan Trọng
            </h2>
          </div>
          <Link prefetch={false}
            href="/timeline"
            className="text-xs font-sans font-medium text-crimson hover:underline flex items-center gap-1"
          >
            <span>Mở toàn bộ dòng thời gian</span>
            <Icon name="chevron-right" className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredYears.map((item) => (
            <Link prefetch={false}
              key={item.year}
              href={timelineHref(item.year)}
              aria-label={`${item.label} (${item.year}): so sánh với Trung Quốc và thế giới`}
              className="group p-6 rounded-2xl bg-white/80 border border-paper-300/40 shadow-editorial hover:shadow-lg hover:border-paper-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-serif font-bold text-paper-900 group-hover:text-crimson transition-colors">
                    {item.year}
                  </span>
                  <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-paper-100 text-paper-800 border border-paper-300/50">
                    So sánh 3 bên
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
                <Icon name="chevron-right" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. NĂM THỜI KỲ TRỌNG TÂM */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-paper-100/40 border-t border-paper-300/40">
        <div className="max-w-8xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-crimson block mb-2">
              Các giai đoạn
            </span>
            <h2 className="text-3xl font-serif text-paper-900 font-normal">
              5 Giai Đoạn Phát Triển Của Dân Tộc
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HISTORICAL_ERAS.map((era) => (
              <div
                key={era.id}
                className="p-5 rounded-2xl bg-white/70 border border-paper-300/40 shadow-editorial flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-serif font-bold text-crimson mb-2">
                    Giai đoạn {era.romanNumeral}
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
                  <Link prefetch={false}
                    href={`/pathways#${era.id}`}
                    className="text-[11px] font-sans font-medium text-crimson hover:underline flex items-center justify-between"
                  >
                    <span>Xem giai đoạn {era.name}</span>
                    <Icon name="chevron-right" className="w-3 h-3" />
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

