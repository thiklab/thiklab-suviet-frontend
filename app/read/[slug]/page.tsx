import { notFound, permanentRedirect } from "next/navigation";
import { docHref } from "@/lib/seo/slug";

// Đường dẫn cũ /read/<Tiêu_đề> chuyển vĩnh viễn sang /doc/<slug>
export default function LegacyReadPage({ params }: { params: { slug: string } }) {
  let title: string;
  try {
    title = decodeURIComponent(params.slug).replace(/_/g, " ").trim();
  } catch {
    notFound();
  }
  if (!title) notFound();
  permanentRedirect(docHref(title));
}
