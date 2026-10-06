import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ReadyExpat Berlin — Anmeldung PDF in English";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#0f172a",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Blue accent bar left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 8,
            height: 630,
            background: "#0075FF",
          }}
        />

        {/* Grid dots background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow blob */}
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 80,
            width: 500,
            height: 400,
            background: "radial-gradient(ellipse at center, rgba(0,117,255,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Left content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 64px 56px 80px",
            flex: 1,
          }}
        >
          {/* Top: brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
                border: "2px solid #0075FF",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0075FF",
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              R
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              ReadyExpat Berlin
            </span>
          </div>

          {/* Middle: headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(0,117,255,0.15)",
                border: "1px solid rgba(0,117,255,0.4)",
                borderRadius: 999,
                padding: "6px 18px",
                width: "fit-content",
              }}
            >
              <span
                style={{
                  color: "#60a5fa",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Expat Guide · Berlin · 2026
              </span>
            </div>

            <div
              style={{
                color: "white",
                fontSize: 58,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              Anmeldung Berlin
              <br />
              <span style={{ color: "#0075FF" }}>in English.</span>
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              No German required. All 54 fields correct.
              <br />
              Ready-to-print PDF in 5 minutes.
            </div>
          </div>

          {/* Bottom: badges */}
          <div style={{ display: "flex", gap: 12 }}>
            {["€10 one-time", "54 fields filled", "Correct German PDF"].map(
              (badge) => (
                <div
                  key={badge}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8,
                    padding: "8px 16px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {badge}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right: form mockup card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 80,
            paddingLeft: 20,
          }}
        >
          <div
            style={{
              width: 280,
              background: "white",
              borderRadius: 16,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Form header */}
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#6b7693",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 4,
              }}
            >
              Anmeldeformular Berlin
            </div>

            {/* Form rows */}
            {[
              { label: "Familienname", value: "Smith" },
              { label: "Vornamen", value: "John" },
              { label: "Staatsangehörigkeit", value: "amerikanisch" },
              { label: "Familienstand", value: "verheiratet" },
              { label: "Tag des Einzugs", value: "01.06.2026" },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e6ebf5",
                    borderRadius: 6,
                    padding: "5px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0a1638",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}

            {/* Green badge */}
            <div
              style={{
                marginTop: 8,
                background: "#16a34a",
                borderRadius: 999,
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: "white",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              ✓ Ready to print
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
