import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/Header";

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sử Việt Niên Biểu — Khám phá Lịch sử Việt Nam",
  description: "Trải nghiệm đọc và đối chiếu lịch sử Việt Nam với phong cách Editorial tối giản, khai thác nguồn dữ liệu mở từ Wikipedia tiếng Việt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${lora.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-paper-50 text-paper-900 font-serif antialiased selection:bg-crimson/15 selection:text-crimson-deep flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-paper-300/40 py-8 bg-paper-100/50 text-center text-xs font-sans text-paper-800/60">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p className="font-serif font-medium text-paper-900">
              Sử Việt Niên Biểu — Trực quan hóa Di sản Lịch sử
            </p>
            <p>
              Dữ liệu tư liệu mở được trích xuất và chuẩn hóa từ Wikipedia tiếng Việt.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

