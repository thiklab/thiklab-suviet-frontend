import { JsonLd } from "@/components/seo/JsonLd";
import { TimelineExplorer } from "@/components/timeline/TimelineExplorer";
import { YearEditorial } from "@/components/timeline/YearEditorial";
import { formatYear } from "@/lib/constants/timeline-data";
import { articleLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { CONTENT_LAST_MODIFIED } from "@/lib/seo/site";
import { yearDescription, yearPath, yearTitle } from "@/lib/seo/yearMeta";
import { getYearEntry } from "@/lib/wikipedia/yearEntry";

export async function YearView({ year, canonicalYear = year }: { year: number; canonicalYear?: number }) {
  const wiki = await getYearEntry(year);
  const path = yearPath(canonicalYear);
  const title = yearTitle(year);

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            headline: title,
            description: yearDescription(year),
            path,
            basedOn: year > 0 ? `https://vi.wikipedia.org/wiki/${year}` : `https://vi.wikipedia.org/wiki/${-year}_TCN`,
            dateModified: CONTENT_LAST_MODIFIED,
          }),
          breadcrumbLd([
            { name: "Trang chủ", path: "/" },
            { name: "Dòng thời gian", path: "/timeline" },
            { name: `Năm ${formatYear(year)}`, path },
          ]),
        ]}
      />
      <TimelineExplorer initialYear={year} initialWiki={wiki}>
        <YearEditorial year={year} wiki={wiki} />
      </TimelineExplorer>
    </>
  );
}
