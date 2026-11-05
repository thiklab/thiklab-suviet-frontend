import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "./site";

interface BuildArgs {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  modifiedTime?: string;
  noindex?: boolean;
}

// openGraph của trang con thay thế hoàn toàn của layout, nên phải lặp lại locale và siteName
export function buildMetadata({ title, description, path, type = "website", modifiedTime, noindex }: BuildArgs): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "vi_VN",
      type,
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}
