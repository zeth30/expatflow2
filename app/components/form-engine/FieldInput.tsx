"use client";
// FORM ENGINE · generic field renderer
// Renders one FieldDef (text/date/select/boolean/euro) with short explain,
// optional deep-dive expander, and the neutral your-decision banner.
// Non-string select values (e.g. boolean | null) plug in via fd.selectMap.

import React from "react";
import type { FieldDef } from "./types";
import { MoreInfo } from "./MoreInfo";

const NAVY = "#0f172a";
const BLUE = "#0075FF";
const MUTED = "#64748b";

// Personalised tip, shown under a field once earlier answers make it relevant
export function TipBox({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 10, padding: "11px 14px", borderRadius: 12, background: "linear-gradient(135deg,#f0f9ff,#eef6ff)", border: "1px solid #bfdbfe" }}>
      <span style={{ fontSize: 15, lineHeight: 1.3, flexShrink: 0 }} aria-hidden>💡</span>
      <p style={{ color: "#1e3a8a", fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  );
}

export function FieldInput<TForm extends Record<string, any>>({
  fd, form, setForm, decisionHelp,
}: {
  fd: FieldDef<TForm>;
  form: TForm;
  setForm: (f: TForm) => void;
  // Product-specific pointer for decision fields, e.g. where the official
  // help lives ("Check ELSTER's official help for this field…").
  decisionHelp: string;
}) {
  if (fd.showIf && !fd.showIf(form)) return null;
  const val = form[fd.key];
  const set = (v: any) => setForm({ ...form, [fd.key]: v });
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontWeight: 700, color: NAVY, fontSize: 14, marginBottom: 2 }}>
        {fd.label}
        <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 12, marginLeft: 8 }}>{fd.deLabel}</span>
      </label>
      {fd.explain && fd.explain.split("\n").map((para, i) => (
        <p key={i} style={{ color: MUTED, fontSize: 12.5, lineHeight: 1.55, margin: i === 0 ? "4px 0 6px" : "0 0 6px" }}>{para}</p>
      ))}
      {fd.more && <MoreInfo text={fd.more} />}
      {fd.decision && (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a", marginBottom: 8 }}>
          <p style={{ fontSize: 11.5, color: "#92400e", lineHeight: 1.5 }}>
            <strong>Your decision.</strong> We explain the mechanics; we don&apos;t recommend an option. Unsure? {decisionHelp}
          </p>
        </div>
      )}
      {fd.type === "choice" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {fd.options!.map(o => {
            const on = val === o.value;
            return (
              <button key={o.value} onClick={() => set(o.value)} style={{
                textAlign: "left", padding: "14px 16px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                border: on ? `2px solid ${BLUE}` : "1px solid #e2e8f0", background: on ? "#eff6ff" : "white",
                boxShadow: on ? "0 4px 14px rgba(0,117,255,0.15)" : "0 1px 2px rgba(15,23,42,0.04)",
              }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: on ? BLUE : NAVY }}>{o.label}</div>
                {o.desc && <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, marginTop: 3 }}>{o.desc}</div>}
              </button>
            );
          })}
        </div>
      ) : fd.type === "boolean" ? (
        <div style={{ display: "flex", gap: 10 }}>
          {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map(({ v, l }) => (
            <button key={l} onClick={() => set(v)} style={{
              flex: 1, padding: "11px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: 14,
              border: val === v ? `2px solid ${BLUE}` : "1px solid #e2e8f0",
              background: val === v ? "#eff6ff" : "white", color: val === v ? BLUE : MUTED,
            }}>{l}</button>
          ))}
        </div>
      ) : fd.type === "select" ? (
        <select
          value={fd.selectMap ? fd.selectMap.fromValue(val) : String(val ?? "")}
          onChange={e => set(fd.selectMap ? fd.selectMap.toValue(e.target.value) : e.target.value)}
          style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", background: "white", color: NAVY }}>
          <option value="">— select —</option>
          {fd.options!.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={fd.type === "date" ? "date" : "text"}
          inputMode={fd.type === "euro" ? "numeric" : undefined}
          value={String(val ?? "")}
          placeholder={fd.placeholder}
          onChange={e => set(fd.type === "euro" ? e.target.value.replace(/[^\d]/g, "") : e.target.value)}
          style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", color: NAVY, boxSizing: "border-box" }}
        />
      )}
      {(() => {
        const tip = fd.tip?.(form);
        return tip ? <TipBox text={tip} /> : null;
      })()}
    </div>
  );
}
