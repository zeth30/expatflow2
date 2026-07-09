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
      {fd.type === "boolean" ? (
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
    </div>
  );
}
