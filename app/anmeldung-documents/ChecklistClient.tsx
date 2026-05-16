"use client";
import { useState } from "react";

const BASE_DOCS = [
  { id: "passport", label: "Valid passport or national ID",     sub: "EU citizens may use their national identity card. Non-EU citizens must bring their passport — IDs from outside the EU are not accepted.", required: true },
  { id: "wgb",      label: "Wohnungsgeberbestätigung",          sub: "Your landlord's signed confirmation that you have moved in. Legally required — your rental contract alone is not accepted.", required: true, link: "/wohnungsgeberbestaetigung" },
  { id: "form",     label: "Completed Anmeldeformular",         sub: "All 54 fields completed in German, every date in DD.MM.YYYY, every entry correctly translated. Print and sign before you arrive.", required: true },
];

const COND_DOCS = [
  { id: "visa",      flag: "noneu",   label: "Current visa or residence permit",          sub: "Non-EU only. Bring your passport plus your current visa or residence permit (Aufenthaltstitel). Register early — your Anmeldebestätigung/Meldebestätigung is required for the residence permit application." },
  { id: "marriage",  flag: "married", label: "Marriage certificate",                      sub: "Some Bürgerämter accept English-language certificates; others require certified German translations. A certified German translation is always the safest option." },
  { id: "birth",     flag: "kids",    label: "Birth certificate for each child",           sub: "Original or certified copy. If the document is not in German, bring a certified translation." },
  { id: "extraform", flag: "multi",   label: "Additional Anmeldeformular sheets",          sub: "The form fits two people per sheet. For 3+ people you need multiple completed sheets — one per pair. Each sheet fully filled and signed separately." },
];

const CHIPS = [
  { flag: "noneu",   label: "Non-EU citizen" },
  { flag: "married", label: "Married" },
  { flag: "kids",    label: "Registering children" },
  { flag: "multi",   label: "3+ people on one form" },
];

const C = 2 * Math.PI * 50; // circumference

export function ChecklistClient() {
  const [flags, setFlags]     = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleFlag = (f: string) =>
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(f)) { next.delete(f); setChecked((c) => { const nc = new Set(c); nc.delete(COND_DOCS.find((d) => d.flag === f)?.id ?? ""); return nc; }); }
      else next.add(f);
      return next;
    });

  const toggleDoc = (id: string) =>
    setChecked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const visibleCond = COND_DOCS.filter((d) => flags.has(d.flag));
  const allDocs = [...BASE_DOCS, ...visibleCond];
  const total   = allDocs.length;
  const done    = allDocs.filter((d) => checked.has(d.id)).length;
  const pct     = total ? Math.round((done / total) * 100) : 0;
  const offset  = C - (C * pct) / 100;

  const ringColor = pct === 100 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--rose)";
  const verdict   = pct === 100 ? { cls: "ok",  txt: "Ready for your appointment" }
                  : pct >= 60   ? { cls: "warn", txt: `Almost there — ${total - done} to go` }
                  :               { cls: "bad",  txt: "Missing required documents — appointment will fail" };

  return (
    <div>
      {/* Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
        {CHIPS.map((c) => (
          <button
            key={c.flag}
            onClick={() => toggleFlag(c.flag)}
            style={{ all: "unset", cursor: "pointer", padding: "10px 16px", borderRadius: 999, border: `1.5px solid ${flags.has(c.flag) ? "var(--ink)" : "var(--line)"}`, background: flags.has(c.flag) ? "var(--ink)" : "white", fontWeight: 700, fontSize: 14, color: flags.has(c.flag) ? "white" : "var(--ink-2)", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .15s", fontFamily: "inherit" }}
          >
            <span style={{ width: 14, height: 14, borderRadius: 4, border: "1.5px solid currentColor", display: "grid", placeItems: "center", opacity: flags.has(c.flag) ? 1 : 0.5 }}>
              {flags.has(c.flag) && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1.5 5 4 7.5 8.5 2"/></svg>}
            </span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Checklist + ring */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, marginTop: 28, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allDocs.map((doc) => {
            const isDone = checked.has(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => toggleDoc(doc.id)}
                style={{ background: isDone ? "var(--green-tint)" : "white", border: `1px solid ${isDone ? "var(--green-bd)" : "var(--line)"}`, borderRadius: 16, padding: "18px 20px", display: "grid", gridTemplateColumns: "28px 1fr", gap: 16, alignItems: "center", cursor: "pointer", transition: "all .2s" }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, border: `2px solid ${isDone ? "var(--green)" : "var(--line)"}`, background: isDone ? "var(--green)" : "transparent", display: "grid", placeItems: "center", transition: "all .2s" }}>
                  {isDone && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.6 : 1 }}>{doc.label}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 3, fontWeight: 500, lineHeight: 1.45 }}>
                    {doc.sub}
                    {"link" in doc && doc.link && !isDone && (
                      <> <a href={doc.link} style={{ color: "var(--blue)", textDecoration: "none", fontWeight: 600 }} onClick={(e) => e.stopPropagation()}>See guide 04 →</a></>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress ring */}
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 22, padding: 28, position: "sticky", top: 24 }}>
          <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 18px" }}>
            <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={ringColor} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset .5s, stroke .3s" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)" }}>{pct}%</div>
          </div>
          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 18 }}>Pre-flight check</div>
          <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginTop: 4 }}><span>{done}</span> of <span>{total}</span> documents ready</div>
          <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 12, fontWeight: 700, fontSize: 14, textAlign: "center", background: verdict.cls === "ok" ? "var(--green-tint)" : verdict.cls === "warn" ? "var(--amber-tint)" : "var(--rose-tint)", color: verdict.cls === "ok" ? "var(--green)" : verdict.cls === "warn" ? "var(--amber)" : "var(--rose)" }}>
            {verdict.txt}
          </div>
        </div>
      </div>
    </div>
  );
}
