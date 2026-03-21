import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Zarządzaj usterkami przez kod QR";
  const description =
    searchParams.get("description") ??
    "Bez aplikacji. Bez rejestracji. Każdy może zgłosić usterkę w 30 sekund.";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: "80px",
      }}
    >
      {/* Niebieski blask w tle */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "99px",
          padding: "8px 20px",
          marginBottom: "32px",
        }}
      >
        <span style={{ color: "#2563eb", fontSize: "18px", fontWeight: 600 }}>
          asseto.pro
        </span>
      </div>

      {/* Tytuł */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "32px",
          maxWidth: "900px",
        }}
      >
        <span
          style={{
            fontSize: title.length > 30 ? "56px" : "72px",
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          {title}
        </span>
      </div>

      {/* Opis */}
      <span
        style={{
          fontSize: "26px",
          color: "#6b7280",
          lineHeight: 1.5,
          maxWidth: "750px",
        }}
      >
        {description}
      </span>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "48px",
          left: "80px",
          right: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#2563eb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 7V5a2 2 0 0 1 2-2h2"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <path
                d="M17 3h2a2 2 0 0 1 2 2v2"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <path
                d="M21 17v2a2 2 0 0 1-2 2h-2"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <path
                d="M7 21H5a2 2 0 0 1-2-2v-2"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <line
                x1="3"
                y1="12"
                x2="21"
                y2="12"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}>
            Asseto
          </span>
        </div>
        <span style={{ fontSize: "22px", color: "#9ca3af", fontWeight: 500 }}>
          asseto.pro
        </span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
