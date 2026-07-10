import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#10131b",
          color: "#e9e4d6",
          padding: "56px 64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            borderBottom: "2px solid rgba(233,228,214,0.35)",
            paddingBottom: "18px",
            fontSize: 22,
            letterSpacing: "0.14em",
            color: "#96aaea",
          }}
        >
          <span>SKY CHART — JUL 2026</span>
          <span style={{ color: "#a8a294" }}>AS·2026.07 · REV A</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, display: "flex", flexWrap: "wrap" }}>
            I take AI from&nbsp;
            <span style={{ fontStyle: "italic", color: "#96aaea" }}>prototype</span>
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.05, display: "flex" }}>
            to&nbsp;<span style={{ fontStyle: "italic", color: "#ef8054" }}>production</span>.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            fontSize: 26,
            color: "#a8a294",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#e86a3c",
                display: "flex",
              }}
            />
            Aditya Sarade — AI Engineer @ Medikabazaar
          </span>
          <span>adityasarade.github.io</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
