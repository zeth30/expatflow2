"use client";
// FORM ENGINE · deep-dive expander ("Tell me more", click — no hover)
// and the MoreBlock parser that turns plain-text paragraphs into
// guide-style visual blocks:
//   "What Yes…" → green card · "What No…" → slate card · "1. …" →
//   numbered chip rows · "· …" → bullet rows · ALL-CAPS prefix → headline.

import React, { useState } from "react";

const NAVY = "#0f172a";
const BLUE = "#0075FF";

function MoreBlock({ para, first }: { para: string; first: boolean }) {
  const mt = first ? 0 : 10;

  // YES / NO cards
  const yesMatch = para.match(/^(What (?:counts as )?Yes[^:]*):\s*(.*)$/i);
  const noMatch = para.match(/^(What No[^:]*):\s*(.*)$/i);
  if (yesMatch || noMatch) {
    const isYes = !!yesMatch;
    const m = (yesMatch ?? noMatch)!;
    return (
      <div style={{
        marginTop: mt, padding: "12px 14px", borderRadius: 12,
        background: isYes ? "#f0fdf4" : "#f8fafc",
        border: isYes ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
        borderLeft: isYes ? "3px solid #16a34a" : "3px solid #94a3b8",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999,
            background: isYes ? "#16a34a" : "#64748b", color: "white", fontSize: 10, fontWeight: 900, letterSpacing: "0.06em",
          }}>
            {isYes ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            )}
            {isYes ? "YES" : "NO"}
          </span>
          <span style={{ color: isYes ? "#166534" : "#475569", fontSize: 11, fontWeight: 700 }}>{m[1]}</span>
        </div>
        <p style={{ color: isYes ? "#14532d" : "#3f4c63", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>{m[2]}</p>
      </div>
    );
  }

  // Numbered rows: "1. Steuer-ID — …"
  const numMatch = para.match(/^(\d+)\.\s+(.*)$/);
  if (numMatch) {
    return (
      <div style={{ marginTop: first ? 0 : 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ width: 22, height: 22, borderRadius: "50%", background: NAVY, color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{numMatch[1]}</span>
        <p style={{ color: "#3f4c63", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>{numMatch[2]}</p>
      </div>
    );
  }

  // Bullet rows: "· …"
  if (para.startsWith("·")) {
    return (
      <div style={{ marginTop: first ? 0 : 7, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, flexShrink: 0, marginTop: 7 }} />
        <p style={{ color: "#3f4c63", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>{para.replace(/^·\s*/, "")}</p>
      </div>
    );
  }

  // ALL-CAPS mini headline: "THE LIMITS (…): body" / "OPTION 1 — use it (…): body"
  const capsMatch = para.match(/^([A-Z][A-Z0-9 ]{3,}(?:\d)?)(\s*[—(:].*)$/);
  if (capsMatch && capsMatch[1] === capsMatch[1].toUpperCase()) {
    const rest = capsMatch[2].replace(/^[\s:—]+/, "");
    return (
      <div style={{ marginTop: mt, paddingTop: first ? 0 : 10, borderTop: first ? "none" : "1px solid #f1f5f9" }}>
        <div style={{ color: "#1d4ed8", fontSize: 10.5, fontWeight: 900, letterSpacing: "0.1em", marginBottom: 4 }}>{capsMatch[1]}</div>
        <p style={{ color: "#3f4c63", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>{rest}</p>
      </div>
    );
  }

  // Default paragraph — first one reads as a lede
  return (
    <p style={{
      color: first ? "#1e293b" : "#3f4c63",
      fontSize: first ? 13.5 : 12.5,
      fontWeight: first ? 600 : 400,
      lineHeight: 1.68,
      margin: `${mt}px 0 0`,
      paddingTop: first ? 0 : 10,
      borderTop: first ? "none" : "1px solid #f1f5f9",
    }}>{para}</p>
  );
}

export function MoreInfo({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const paras = text.split("\n");
  return (
    <div style={{ margin: "4px 0 12px" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "7px 14px 7px 9px", borderRadius: 999,
          border: open ? "1px solid rgba(0,117,255,0.35)" : "1px solid #e6ebf5",
          background: open ? "linear-gradient(135deg,#eff6ff,#e0edff)" : "white",
          boxShadow: open ? "inset 0 1px 2px rgba(0,64,255,0.06)" : "0 1px 2px rgba(15,23,42,0.05)",
          color: open ? "#1d4ed8" : "#334155",
          fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.18s ease",
        }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 19, height: 19, borderRadius: "50%",
          background: open ? BLUE : "#eff6ff",
          color: open ? "white" : BLUE,
          fontSize: 11, fontWeight: 800, fontStyle: "italic", fontFamily: "Georgia, serif",
          transition: "all 0.18s ease",
        }}>i</span>
        {open ? "Got it" : "Tell me more"}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)", opacity: 0.7 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.32s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{
            marginTop: 10, padding: "16px 18px", borderRadius: 14,
            background: "linear-gradient(180deg,#ffffff 0%,#fafcff 100%)",
            border: "1px solid #e6ebf5",
            boxShadow: "0 10px 30px rgba(15,23,42,0.07), 0 1px 2px rgba(15,23,42,0.04)",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(-4px)",
            transition: "opacity 0.28s ease 0.06s, transform 0.28s ease 0.06s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <span style={{ width: 16, height: 2.5, borderRadius: 2, background: `linear-gradient(90deg,${BLUE},#60a5fa)` }} />
              <span style={{ color: "#64748b", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>In plain English</span>
            </div>
            {paras.map((para, i) => <MoreBlock key={i} para={para} first={i === 0} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
