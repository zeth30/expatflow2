"use client";
import { useState } from "react";

const ROWS = [
  { id: "eid",   label: "EU or EEA eID card with Online-Ausweis chip activated", sub: "elektronischer Personalausweis · only issued to EU/EEA nationals", defaultYes: false },
  { id: "app",   label: "AusweisApp installed on an NFC-capable phone",          sub: "Reads the chip via NFC",                                          defaultYes: false },
  { id: "bund",  label: "BundID account",                                        sub: "Federal digital identity service",                               defaultYes: false },
  { id: "exist", label: "Existing German address already registered",             sub: "Online is for Ummeldung, not first-time registration from abroad", defaultYes: false },
  { id: "city",  label: "City supports online registration",                      sub: "Berlin, Hamburg, Bremen, parts of Bayern · BW · Hessen",         defaultYes: true  },
];

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

export function EligibilityChecker() {
  const [vals, setVals] = useState<Record<string, boolean>>(
    Object.fromEntries(ROWS.map((r) => [r.id, r.defaultYes]))
  );

  const toggle = (id: string, val: boolean) => setVals((v) => ({ ...v, [id]: val }));

  const total = ROWS.length;
  const ok    = ROWS.filter((r) => vals[r.id]).length;
  const allOk = ok === total;

  return (
    <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 22, padding: 28 }}>
      {ROWS.map((row) => {
        const yes = vals[row.id];
        return (
          <div
            key={row.id}
            onClick={() => toggle(row.id, !yes)}
            style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 14, padding: "14px 0", borderBottom: "1px dashed var(--line)", alignItems: "center", cursor: "pointer" }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", transition: "all .2s", background: yes ? "var(--green-tint)" : "var(--rose-tint)", color: yes ? "var(--green)" : "var(--rose)" }}>
              {yes ? <CheckIcon /> : <XIcon />}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15.5 }}>{row.label}</div>
              <div style={{ display: "block", fontWeight: 500, color: "var(--muted)", fontSize: 12.5, marginTop: 2 }}>{row.sub}</div>
            </div>
            <div style={{ display: "flex", gap: 4, padding: 3, background: "#f1f3f9", borderRadius: 8 }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggle(row.id, true)}
                style={{ all: "unset", cursor: "pointer", padding: "5px 10px", fontWeight: 700, fontSize: 12, borderRadius: 6, background: yes ? "var(--green)" : "transparent", color: yes ? "white" : "var(--muted)", fontFamily: "inherit" }}
              >Yes</button>
              <button
                onClick={() => toggle(row.id, false)}
                style={{ all: "unset", cursor: "pointer", padding: "5px 10px", fontWeight: 700, fontSize: 12, borderRadius: 6, background: !yes ? "var(--rose)" : "transparent", color: !yes ? "white" : "var(--muted)", fontFamily: "inherit" }}
              >No</button>
            </div>
          </div>
        );
      })}

      {/* Verdict */}
      <div style={{ marginTop: 22, padding: "26px 28px", borderRadius: 18, background: allOk ? "var(--green-tint)" : "var(--rose-tint)", border: `1px solid ${allOk ? "var(--green-bd)" : "#fecdd3"}` }}>
        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-0.015em", color: allOk ? "var(--green)" : "var(--rose)" }}>
          {allOk ? "✓ You may be eligible for online registration" : "In-person registration only"}
        </h3>
        <p style={{ color: "var(--ink-2)", margin: "8px 0 0", fontSize: 15, lineHeight: 1.55 }}>
          {allOk
            ? "Try the official portal at service.berlin.de. Most non-EU expats will not reach this state — the eID requirement alone excludes them."
            : <><strong>{total - ok} of {total}</strong> requirements unmet. You will register at a Bürgeramt, in person. The eID requirement alone excludes everyone with a non-EU/EEA passport — there is no workaround.</>}
        </p>
      </div>
    </div>
  );
}
