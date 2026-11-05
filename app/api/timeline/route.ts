import { NextRequest, NextResponse } from "next/server";
import { cached } from "@/lib/cache/redis";
import { fetchYearParallelEvents } from "@/lib/wikipedia/yearParser";

export const runtime = "nodejs";

const TTL_SECONDS = 60 * 60 * 24 * 7;

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get("year") ?? "", 10);
  if (isNaN(year) || year < 1 || year > 2026) {
    return NextResponse.json({ error: "Năm không hợp lệ" }, { status: 400 });
  }

  const entry = await cached(`suviet:year:v1:${year}`, TTL_SECONDS, () =>
    fetchYearParallelEvents(year)
  );
  return NextResponse.json(entry);
}
