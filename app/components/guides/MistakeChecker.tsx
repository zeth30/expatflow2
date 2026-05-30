"use client";
import { useState } from "react";

const MISTAKES = [
  { id: "wgb",    label: "Missing Wohnungsgeberbestätigung", detail: "The landlord confirmation form is mandatory. Without it, the clerk turns you away on the spot. Rental contract alone is not accepted." },
  { id: "name",   label: "Name doesn't match passport exactly", detail: "The form must use your name exactly as printed in your passport — including middle names, hyphens, and accents. No nicknames." },
  { id: "fields", label: "Leaving required fields blank", detail: "All marked fields must be filled. Geschlecht (gender) and Staatsangehörigkeit (citizenship) are the most commonly missed." },
  { id: "addr",   label: "Wrong address format", detail: "Street name and house number must be split into separate fields. '12 Hauptstraße' written as a single block is rejected." },
  { id: "date",   label: "Wrong date format", detail: "All dates must be DD.MM.YYYY — not MM/DD/YYYY. US expats get this wrong almost every time." },
  { id: "docs",   label: "Expired or wrong identity document", detail: "Non-EU citizens must bring a passport, not an ID card. EU citizens may use a national ID. All documents must be valid on the day of the appointment." },
];

export function MistakeChecker() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const score = checked.size;
  const all = MISTAKES.length;

  return (
    <div style={{ background: "white", border: "1px solid #e6ebf5", borderRadius: 16, padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#6b7693", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Mistake Checker
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: score === all ? "#16a34a" : "#6b7693" }}>
          {score}/{all} checked
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MISTAKES.map(m => {
          const done = checked.has(m.id);
          return (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
                borderRadius: 12, border: `1.5px solid ${done ? "#bbf7d0" : "#e6ebf5"}`,
                background: done ? "#f0fdf4" : "#fbfcff", cursor: "pointer", textAlign: "left",
                fontFamily: "inherit", transition: "all .15s",
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? "#16a34a" : "#d1d5db"}`,
                background: done ? "#16a34a" : "white", flexShrink: 0, marginTop: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M5 12l5 5 9-9"/></svg>}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: done ? "#15803d" : "#0a1638", marginBottom: 3 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 13, color: "#6b7693", lineHeight: 1.55 }}>{m.detail}</div>
              </div>
            </button>
          );
        })}
      </div>
      {score === all && (
        <div style={{ marginTop: 16, padding: "14px 18px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d" }}>
            ✓ You've reviewed all 6 mistakes — or let ReadyExpat handle them automatically.
          </div>
        </div>
      )}
    </div>
  );
}
