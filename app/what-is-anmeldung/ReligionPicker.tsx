"use client";
import { useState } from "react";

const OPTIONS = [
  {
    key: "OA",
    label: "OA · blank",
    h: "No church tax · safe answer",
    p: "<strong>OA</strong> = \"Ohne Angabe\" (no statement). Zero negative consequences. You can join a recognised church later if you want — it is not a permanent declaration.",
    amount: "+€0 / month",
    danger: false,
  },
  {
    key: "RK",
    label: "RK · katholisch",
    h: "Kirchensteuer triggered · ~9%",
    p: "Declaring <strong>RK · römisch-katholisch</strong> activates church tax. 9% of your income tax in most states (8% in Bayern &amp; Baden-Württemberg). On €60k salary that is ~€1,000/year, automatically.",
    amount: "≈ +€85 / month",
    danger: true,
  },
  {
    key: "EV",
    label: "EV · evangelisch",
    h: "Kirchensteuer triggered · ~9%",
    p: "Declaring <strong>EV · evangelisch</strong> activates church tax. Same rate as RK — 9% of income tax in most states. Collected through payroll automatically.",
    amount: "≈ +€85 / month",
    danger: true,
  },
  {
    key: "IS",
    label: "IS · islamisch",
    h: "No church tax",
    p: "<strong>IS · islamisch</strong> is not currently a Körperschaft des öffentlichen Rechts in most German states, so no Kirchensteuer is collected. Same applies to most faiths — only the major recognised denominations trigger it.",
    amount: "+€0 / month",
    danger: false,
  },
];

export function ReligionPicker() {
  const [active, setActive] = useState("OA");
  const cur = OPTIONS.find((o) => o.key === active)!;

  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 32, alignItems: "start" }}>
        {/* Mock form */}
        <div style={{ background: "var(--blue-soft)", border: "1px solid var(--line)", borderRadius: 18, padding: 22, fontFamily: "'JetBrains Mono', monospace" }}>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "2px solid var(--ink)", marginBottom: 6 }}>
            <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 13 }}>ANMELDEFORMULAR</span>
            <span style={{ color: "var(--muted)", fontSize: 10 }}>Field 14 of 54</span>
          </div>
          {[
            { k: "12 — Familienstand", v: "ledig", muted: true },
            { k: "13 — Staatsangehörigkeit", v: "…", muted: true },
          ].map((row) => (
            <div key={row.k} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", padding: "10px 0", borderBottom: "1px solid rgba(10,22,56,.05)", alignItems: "center", gap: 14, opacity: 0.35 }}>
              <span style={{ fontSize: 11, color: "var(--ink-2)", fontWeight: 600 }}>{row.k}</span>
              <span style={{ fontSize: 12, color: "var(--ink)", padding: "7px 11px", background: "white", borderRadius: 5, border: "1px solid var(--line)" }}>{row.v}</span>
            </div>
          ))}
          {/* Target row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", padding: "16px 0", borderBottom: "2px solid var(--rose)", borderTop: "2px solid var(--rose)", alignItems: "center", gap: 14, animation: "pulseRow 2s ease-in-out infinite" }}>
            <span style={{ fontSize: 11, color: "var(--rose)", fontWeight: 700 }}>14 — Religionsgesellschaft</span>
            <span style={{ fontSize: 12, color: "var(--ink)", padding: "7px 11px", background: "white", borderRadius: 5, border: "1px solid var(--line)", fontWeight: 700 }}>{active}</span>
          </div>
          {[
            { k: "15 — Tag des Einzugs", v: "…" },
            { k: "16 — Postleitzahl", v: "…" },
          ].map((row) => (
            <div key={row.k} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", padding: "10px 0", borderBottom: "1px solid rgba(10,22,56,.05)", alignItems: "center", gap: 14, opacity: 0.35 }}>
              <span style={{ fontSize: 11, color: "var(--ink-2)", fontWeight: 600 }}>{row.k}</span>
              <span style={{ fontSize: 12, color: "var(--ink)", padding: "7px 11px", background: "white", borderRadius: 5, border: "1px solid var(--line)" }}>{row.v}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase" }}>Pick what you&apos;d write</div>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {OPTIONS.map((o) => (
              <button
                key={o.key}
                onClick={() => setActive(o.key)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  padding: "9px 12px",
                  border: `2px solid ${active === o.key ? "var(--ink)" : "var(--line)"}`,
                  borderRadius: 9,
                  fontWeight: 700,
                  fontSize: 12.5,
                  background: active === o.key ? "var(--ink)" : "white",
                  color: active === o.key ? "white" : "var(--ink)",
                  flex: 1,
                  minWidth: 100,
                  textAlign: "center",
                  transition: "all .15s",
                  fontFamily: "inherit",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>

          {/* Impact box */}
          <div
            style={{
              marginTop: 20,
              padding: "18px 20px",
              borderRadius: 14,
              background: cur.danger ? "var(--rose-tint)" : "var(--green-tint)",
              border: `1px solid ${cur.danger ? "#fecdd3" : "var(--green-bd)"}`,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 17 }}>{cur.h}</div>
            <div
              style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 6, color: "var(--ink-2)" }}
              dangerouslySetInnerHTML={{ __html: cur.p }}
            />
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 24,
                fontWeight: 800,
                marginTop: 10,
                letterSpacing: "-0.02em",
                color: cur.danger ? "var(--rose)" : "var(--green)",
              }}
            >
              {cur.amount}
            </div>
          </div>

          <div style={{ marginTop: 16, padding: "16px 18px", background: "var(--blue-soft)", borderRadius: 12, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--ink)" }}>Already a church member and want to leave?</strong> That requires a separate process at the{" "}
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>Amtsgericht</span> — the <em>Kirchenaustritt</em>. Not done on this form.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseRow {
          0%, 100% { background: transparent; }
          50% { background: rgba(225,29,72,.06); }
        }
        @media (max-width: 880px) {
          .religion-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
