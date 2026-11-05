import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-serif text-paper-900 mb-4">Không tìm thấy trang</h1>
      <p className="text-sm font-serif text-paper-800/70 max-w-md mb-6 leading-relaxed">
        Trang hoặc bài viết bạn tìm không tồn tại, hoặc đã được đổi đường dẫn.
      </p>
      <nav aria-label="Gợi ý điều hướng" className="flex flex-wrap justify-center gap-3 text-xs font-sans">
        <Link prefetch={false} href="/" className="px-5 py-2.5 rounded-full bg-paper-900 text-paper-50 hover:bg-crimson transition-colors">
          Về trang chủ
        </Link>
        <Link prefetch={false} href="/timeline/938" className="px-5 py-2.5 rounded-full bg-paper-100 border border-paper-300 text-paper-900 hover:bg-paper-200 transition-colors">
          Xem dòng thời gian năm 938
        </Link>
      </nav>
    </main>
  );
}
