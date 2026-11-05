import React from "react";
import { fetchWikiArticle } from "@/lib/wikipedia/client";
import { ReaderView } from "@/components/reader/ReaderView";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ReadPage({ params }: PageProps) {
  const decodedTitle = decodeURIComponent(params.slug).replace(/_/g, " ");
  const article = await fetchWikiArticle(decodedTitle);

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif text-paper-900 mb-4">
          Không tìm thấy bài viết
        </h1>
        <p className="text-sm font-serif text-paper-800/70 max-w-md mb-6 leading-relaxed">
          Không thể tìm thấy hoặc xử lý tư liệu cho tiêu đề "{decodedTitle}" từ Wikipedia tiếng Việt.
        </p>
        <Link
          href="/timeline"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-paper-900 text-paper-50 text-xs font-sans hover:bg-crimson transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Trở về Tam Trục Niên Biểu</span>
        </Link>
      </div>
    );
  }

  return <ReaderView article={article} />;
}

