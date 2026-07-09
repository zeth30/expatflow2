"use client";
// ═══════════════════════════════════════════════════════════════════
//  ELSTER PRACTICE SIMULATOR
//  Interactive rehearsal of the FsE EUn flow: one screen per section,
//  the user's own German answers pre-filled, German nav buttons.
//  Deliberately a GENERIC German-government form aesthetic — no ELSTER
//  logo, no ELSTER green. Permanent not-affiliated banner. Nothing is
//  transmitted anywhere; data stays in the browser (as everywhere).
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { X, ExternalLink, CheckCircle2 } from "lucide-react";
import { buildAnswerRows, type SteuerForm } from "./steuer-data";

const NAVY = "#0f172a";
const BLUE = "#0075FF";

export function SteuerSimulator({ form, onClose }: { form: SteuerForm; onClose: () => void }) {
  const sections = buildAnswerRows(form);
  const [idx, setIdx] = useState(0); // 0..sections.length → last index = finish screen
  const finished = idx >= sections.length;
  const sec = finished ? null : sections[idx];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "#e9edf2", overflowY: "auto", fontFamily: "system-ui, Arial, sans-serif" }}>
      {/* Top bar: product frame + disclaimer */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: NAVY, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ color: "white", fontWeight: 800, fontSize: 13 }}>Practice Simulator</span>
        <span style={{ color: "#93c5fd", fontSize: 11, flex: 1, minWidth: 220 }}>
          Simulation for practice only — not affiliated with or endorsed by ELSTER / Finanzverwaltung. Nothing is submitted.
        </span>
        <button onClick={onClose} aria-label="Close simulator" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "white", borderRadius: 8, padding: "6px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
          <X size={13} /> Exit
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 60px" }}>
        {/* Faux government-portal chrome */}
        <div style={{ background: "white", border: "1px solid #cdd5df", borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 10px rgba(15,23,42,0.08)" }}>
          {/* Portal header (generic) */}
          <div style={{ borderBottom: "3px solid #37424f", padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937" }}>Fragebogen zur steuerlichen Erfassung</div>
              <div style={{ fontSize: 11.5, color: "#6b7280" }}>Aufnahme einer gewerblichen, selbständigen (freiberuflichen) Tätigkeit — Einzelunternehmen</div>
            </div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>
              {finished ? "Prüfen & Absenden" : `Seite ${idx + 1} von ${sections.length + 1}`}
            </div>
          </div>

          {/* Progress */}
          <div style={{ height: 4, background: "#eef1f5" }}>
            <div style={{ height: 4, background: "#37424f", width: `${Math.round(((Math.min(idx, sections.length) + 1) / (sections.length + 1)) * 100)}%`, transition: "width 0.25s" }} />
          </div>

          {!finished && sec ? (
            <div style={{ padding: "22px" }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>{sec.title}</div>
              <div style={{ fontSize: 12, color: BLUE, fontWeight: 600, marginBottom: 18 }}>{sec.titleEn} — your answers are already in place</div>

              {sec.rows.map((r, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <label style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 11.5, color: "#4b5563", marginBottom: 4 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 16, borderRadius: 3, background: "#eef1f5", border: "1px solid #d5dbe3", color: "#374151", fontWeight: 700, fontSize: 9.5, padding: "0 4px" }}>{r.nr}</span>
                    <span style={{ fontWeight: 600 }}>{r.label}</span>
                  </label>
                  {r.instruction ? (
                    <div style={{ padding: "9px 12px", borderRadius: 4, background: "#fffbeb", border: "1px dashed #f0c948", color: "#92400e", fontSize: 12.5, fontStyle: "italic" }}>
                      ☐ {r.de}
                    </div>
                  ) : (
                    <input
                      readOnly
                      value={r.de || ""}
                      placeholder="— leave empty —"
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 4, border: "1px solid #aeb8c4", background: r.de ? "#fbfdff" : "#f5f7fa", color: "#111827", fontSize: 13, fontFamily: "inherit" }}
                    />
                  )}
                  {r.enHint && <div style={{ fontSize: 10.5, color: "#8b96a5", marginTop: 3 }}>{r.enHint}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "34px 22px", textAlign: "center" }}>
              <CheckCircle2 size={40} color="#16a34a" style={{ marginBottom: 14 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>Das war&apos;s — you&apos;ve seen every screen.</div>
              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 20px" }}>
                In the real Mein ELSTER, this is where you&apos;d review the summary of all your entries and press <strong>„Absenden“</strong>. You now know exactly what every screen wants from you — with your answer sheet next to you, the real thing is a copy-paste exercise.
              </p>
              <a href="https://www.elster.de/eportal/login" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: `linear-gradient(135deg,${BLUE},#2563eb)`, color: "white", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
                I&apos;m ready — open Mein ELSTER <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Nav bar — German like the real thing */}
          <div style={{ borderTop: "1px solid #e2e7ed", padding: "14px 22px", display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => (idx === 0 ? onClose() : setIdx(i => i - 1))}
              style={{ padding: "9px 20px", borderRadius: 4, border: "1px solid #aeb8c4", background: "white", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              {idx === 0 ? "Abbrechen" : "Zurück"}
            </button>
            {!finished && (
              <button
                onClick={() => setIdx(i => i + 1)}
                style={{ padding: "9px 24px", borderRadius: 4, border: "none", background: "#37424f", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Weiter
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#8b96a5", marginTop: 14 }}>
          Practice simulation by ReadyExpat. Generic form design — the real Mein ELSTER looks different in detail, but asks these fields with these numbers. Nothing you see here is transmitted.
        </p>
      </div>
    </div>
  );
}
