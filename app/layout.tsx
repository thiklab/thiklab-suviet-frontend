import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo/jsonld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Khám phá lịch sử Việt Nam theo mốc năm`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="min-h-screen bg-paper-50 text-paper-900 font-serif antialiased selection:bg-crimson/15 selection:text-crimson-deep flex flex-col">
        <JsonLd data={[websiteLd(), organizationLd()]} />
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-paper-300/40 py-8 bg-paper-100/50 text-center text-xs font-sans text-paper-800/60">
          <div className="max-w-8xl mx-auto px-4 space-y-2">
            <p className="font-serif font-medium text-paper-900">
              Sử Việt Niên Biểu — Lịch sử Việt Nam dễ đọc, dễ hiểu
            </p>
            <p>
              Dữ liệu nội dung mở được trích xuất và chuẩn hóa từ Wikipedia tiếng Việt (giấy phép CC BY-SA 4.0).
            </p>
            <p>
              <a
                href="https://tuan.thich.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-crimson transition-colors"
              >
                from Tuan Nguyen built with ❤️
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
