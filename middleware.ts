import { NextRequest, NextResponse } from "next/server";

// /timeline?year=1075 -> /timeline/1075 (bỏ hẳn query để không sinh URL trùng)
export function middleware(req: NextRequest) {
  const year = req.nextUrl.searchParams.get("year");
  if (year && /^\d{1,4}$/.test(year) && parseInt(year, 10) > 0) {
    const url = req.nextUrl.clone();
    url.pathname = `/timeline/${parseInt(year, 10)}`;
    url.search = "";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: "/timeline" };
