import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "./site";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/icon"),
});

// Không có SearchAction vì site chưa có ô tìm kiếm
export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": SITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "vi",
  publisher: { "@id": ORG_ID },
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

interface ArticleArgs {
  headline: string;
  description: string;
  path: string;
  basedOn: string;
  datePublished?: string;
  dateModified: string;
  image?: string;
}

export const articleLd = ({ headline, description, path, basedOn, datePublished, dateModified, image }: ArticleArgs) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline,
  description,
  inLanguage: "vi",
  mainEntityOfPage: absoluteUrl(path),
  url: absoluteUrl(path),
  datePublished: datePublished ?? dateModified,
  dateModified,
  author: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
  isBasedOn: basedOn,
  ...(image ? { image } : {}),
});
