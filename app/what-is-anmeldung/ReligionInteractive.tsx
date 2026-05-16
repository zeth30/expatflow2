"use client";

import { useState, useEffect, useRef } from "react";

const RELIGION_DATA: Record<string, { h: string; p: string; amount: string; danger: boolean }> = {
  OA: {
    h: "No church tax · safe answer",
    p: "<strong>OA</strong> = \"Ohne Angabe\" (no statement). Zero negative consequences. You can join a recognised church later if you want — it is not a permanent declaration.",
    amount: "+€0 / month",
    danger: false,
  },
  RK: {
    h: "Kirchensteuer triggered · ~9%",
    p: "Declaring <strong>RK · römisch-katholisch</strong> activates church tax. 9% of your income tax in most states (8% in Bayern &amp; Baden-Württemberg). On a €60k salary that is ~€1,000/year, automatically.",
    amount: "≈ +€85 / month",
    danger: true,
  },
  EV: {
    h: "Kirchensteuer triggered · ~9%",
    p: "Declaring <strong>EV · evangelisch</strong> activates church tax. Same rate as RK — 9% of income tax in most states. Collected through payroll automatically.",
    amount: "≈ +€85 / month",
    danger: true,
  },
  IS: {
    h: "No church tax",
    p: "<strong>IS · islamisch</strong> is not currently a Körperschaft des öffentlichen Rechts in most German states, so no Kirchensteuer is collected. Same applies to most faiths — only the major recognised denominations trigger it.",
    amount: "+€0 / month",
    danger: false,
  },
};

export function ReligionInteractive() {
  const [selected, setSelected] = useState("OA");
  const data = RELIGION_DATA[selected];

  // Scroll reveal
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in"); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="g-card g-reveal" ref={ref} style={{ padding: 32 }}>
      <div className="g-form-grid">
        {/* Mock form */}
        <div className="g-religion-form">
          <div className="formhd">
            <div className="t">ANMELDEFORMULAR</div>
            <div className="c">Field 14 of 54</div>
          </div>
          <div className="frow muted"><div className="k">12 — Familienstand</div><div className="v">ledig</div></div>
          <div className="frow muted"><div className="k">13 — Staatsangehörigkeit</div><div className="v">…</div></div>
          <div className="frow target">
            <div className="k">14 — Religionsgesellschaft</div>
            <div className="v" style={{ fontWeight: 700 }}>{selected}</div>
          </div>
          <div className="frow muted"><div className="k">15 — Tag des Einzugs</div><div className="v">…</div></div>
          <div className="frow muted"><div className="k">16 — Postleitzahl</div><div className="v">…</div></div>
        </div>

        {/* Controls + impact */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase" }}>
            Pick what you&apos;d write
          </div>
          <div className="g-field-options">
            {(["OA", "RK", "EV", "IS"] as const).map(key => (
              <button
                key={key}
                className={selected === key ? "active" : ""}
                onClick={() => setSelected(key)}
              >
                {key === "OA" ? "OA · blank" : key === "RK" ? "RK · katholisch" : key === "EV" ? "EV · evangelisch" : "IS · islamisch"}
              </button>
            ))}
          </div>

          <div className={`g-impact${data.danger ? " danger" : " safe"}`}>
            <div className="impact-h">{data.h}</div>
            <div className="impact-p" dangerouslySetInnerHTML={{ __html: data.p }} />
            <div className="impact-num">{data.amount}</div>
          </div>

          <div style={{ marginTop: 16, padding: "16px 18px", background: "var(--blue-soft)", borderRadius: 12, fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--ink)" }}>Already a church member and want to leave?</strong>{" "}
            That requires a separate process at the <span style={{ fontFamily: "ui-monospace, monospace" }}>Standesamt</span> — the <em>Kirchenaustritt</em>. Not done on this form. Costs approx. €30–40.
          </div>
        </div>
      </div>
    </div>
  );
}
