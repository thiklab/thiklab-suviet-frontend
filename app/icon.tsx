import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const font = await readFile(join(process.cwd(), "assets/fonts/BeVietnamPro-700.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#9B1C1C",
          color: "#FAF7F2",
          fontSize: 40,
          fontWeight: 700,
          borderRadius: 14,
          fontFamily: "Be Vietnam Pro",
        }}
      >
        Sử
      </div>
    ),
    { ...size, fonts: [{ name: "Be Vietnam Pro", data: font, weight: 700, style: "normal" }] }
  );
}
