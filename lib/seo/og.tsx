import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

const loadFont = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

interface OgArgs {
  title: string;
  eyebrow?: string;
  subtitle?: string;
}

// Font Be Vietnam Pro đã có đủ dấu tiếng Việt; Satori chỉ nhận TTF/OTF/WOFF
export async function renderOg({ title, eyebrow, subtitle }: OgArgs) {
  const [regular, bold] = await Promise.all([loadFont("BeVietnamPro-400.ttf"), loadFont("BeVietnamPro-700.ttf")]);
  const size = title.length > 50 ? 56 : title.length > 28 ? 72 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#FAF7F2",
          color: "#1F1A17",
          fontFamily: "Be Vietnam Pro",
          borderLeft: "24px solid #9B1C1C",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#9B1C1C", fontWeight: 700, letterSpacing: 2 }}>
          {(eyebrow ?? "NIÊN BIỂU LỊCH SỬ").toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: size, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
          {subtitle && (
            <div style={{ display: "flex", fontSize: 30, marginTop: 24, color: "#5C534C", lineHeight: 1.4 }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5C534C" }}>{SITE_NAME}</div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Be Vietnam Pro", data: regular, weight: 400, style: "normal" },
        { name: "Be Vietnam Pro", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
