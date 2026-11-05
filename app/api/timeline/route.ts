import { NextRequest, NextResponse } from "next/server";
import { getYearEntry } from "@/lib/wikipedia/yearEntry";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get("year") ?? "", 10);
  if (isNaN(year) || year < 1 || year > 2026) {
    return NextResponse.json({ error: "Năm không hợp lệ" }, { status: 400 });
  }

  return NextResponse.json(await getYearEntry(year));
}
