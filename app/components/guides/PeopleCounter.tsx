"use client";
import { useState } from "react";

export function PeopleCounter() {
  const [count, setCount] = useState(2);
  const sheets = Math.ceil(count / 2);

  const change = (n: number) => setCount(c => Math.max(1, Math.min(6, c + n)));

  return (
    <div style={{ background: "white", border: "1px solid #e6ebf5", borderRadius: 16, padding: "28px 32px", maxWidth: 480 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#6b7693", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        How Many People Are Registering?
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <button onClick={() => change(-1)} style={{ width: 44, height: 44, borderRadius: 12, border: "1.5px solid #e6ebf5", background: "#f8fafc", fontSize: 22, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#0a1638" }}>−</button>
        <div style={{ fontSize: 48, fontWeight: 900, color: "#0a1638", letterSpacing: "-0.04em", minWidth: 60, textAlign: "center" }}>{count}</div>
        <button onClick={() => change(1)} style={{ width: 44, height: 44, borderRadius: 12, border: "1.5px solid #e6ebf5", background: "#f8fafc", fontSize: 22, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#0a1638" }}>+</button>
        <div style={{ fontSize: 15, color: "#6b7693", fontWeight: 600 }}>
          {count === 1 ? "person" : "people"}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "14px 18px", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1e40af" }}>Anmeldung sheets needed</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#0040ff" }}>{sheets}</span>
        </div>
        <div style={{ padding: "14px 18px", background: "#fbfcff", border: "1px solid #e6ebf5", borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: "#6b7693", lineHeight: 1.6 }}>
            {count === 1 && "One person — one sheet. Straightforward."}
            {count === 2 && "Two people fit on one sheet. One form, submitted together."}
            {count === 3 && "Three people require two sheets — two on sheet 1, one on sheet 2."}
            {count === 4 && "Four people, two sheets. Two people per sheet."}
            {count === 5 && "Five people, three sheets. Sheet 3 will have one person on it."}
            {count === 6 && "Six people, three sheets — the maximum ReadyExpat supports per order."}
          </div>
        </div>
        {count > 2 && (
          <div style={{ padding: "12px 16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, fontSize: 13, color: "#92400e", lineHeight: 1.55 }}>
            Each sheet must be printed separately and signed. Bring all {sheets} sheets to your appointment.
          </div>
        )}
      </div>
    </div>
  );
}
