import { NextRequest, NextResponse } from "next/server";
import { cached } from "@/lib/cache/redis";

export const runtime = "nodejs";
export const maxDuration = 60;

const WEEK = 7 * 24 * 3600;

async function summarize(title: string): Promise<string | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return null;

  const url = `https://vi.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      onlyMainContent: true,
      formats: [
        {
          type: "json",
          prompt: `Tóm tắt bằng tiếng Việt trong 4-6 câu, bám sát chủ đề của bài viết có tiêu đề "${title}". Chỉ dùng thông tin có trong bài, không thêm thông tin bên ngoài.`,
          schema: {
            type: "object",
            properties: { summary: { type: "string" } },
            required: ["summary"],
          },
        },
      ],
    }),
    signal: AbortSignal.timeout(55_000),
  });
  if (!res.ok) return null;

  const json = await res.json();
  const summary = json?.data?.json?.summary;
  return typeof summary === "string" && summary.trim() ? summary.trim() : null;
}

export async function GET(req: NextRequest) {
  const title = (req.nextUrl.searchParams.get("title") ?? "").trim();
  if (!title || title.length > 200) {
    return NextResponse.json({ error: "Tiêu đề không hợp lệ" }, { status: 400 });
  }

  try {
    const summary = await cached(`suviet:summary:v1:${title}`, WEEK, () => summarize(title), {
      negativeTtl: 60,
    });
    if (!summary) return NextResponse.json({ error: "Không thể tóm tắt" }, { status: 502 });
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ error: "Không thể tóm tắt" }, { status: 502 });
  }
}
