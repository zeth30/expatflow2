"use client";
import { useState } from "react";

export function DeadlineCalculator() {
  const [moveIn, setMoveIn] = useState("");

  const deadline = moveIn
    ? (() => {
        const d = new Date(moveIn + "T12:00:00");
        d.setDate(d.getDate() + 14);
        return d;
      })()
    : null;

  const daysLeft = deadline
    ? Math.ceil((deadline.getTime() - Date.now()) / 86400000)
    : null;

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const status =
    daysLeft === null ? null
    : daysLeft < 0    ? "overdue"
    : daysLeft <= 3   ? "urgent"
    : daysLeft <= 7   ? "soon"
    : "ok";

  const colors: Record<string, { bg: string; border: string; text: string; label: string }> = {
    overdue: { bg: "#fff1f2", border: "#fecdd3", text: "#e11d48", label: "Overdue — register immediately" },
    urgent:  { bg: "#fff7ed", border: "#fed7aa", text: "#d97706", label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left — act now` },
    soon:    { bg: "#fefce8", border: "#fde68a", text: "#ca8a04", label: `${daysLeft} days left — book this week` },
    ok:      { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", label: `${daysLeft} days left — you have time` },
  };

  const c = status ? colors[status] : null;

  return (
    <div style={{ background: "white", border: "1px solid #e6ebf5", borderRadius: 16, padding: "28px 32px", maxWidth: 520 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#6b7693", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        Deadline Calculator
      </div>
      <p style={{ fontSize: 15, color: "#2a3656", marginBottom: 20, lineHeight: 1.6 }}>
        Enter your move-in date — we'll show your Anmeldung deadline.
      </p>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2a3656", marginBottom: 6 }}>
        Move-in date
      </label>
      <input
        type="date"
        value={moveIn}
        onChange={e => setMoveIn(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e6ebf5", fontSize: 15, fontFamily: "inherit", color: "#0a1638", outline: "none", marginBottom: 16 }}
      />
      {deadline && c && (
        <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 6 }}>{c.label}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#0a1638", letterSpacing: "-0.02em" }}>
            Deadline: {fmt(deadline)}
          </div>
          {status === "overdue" && (
            <p style={{ fontSize: 13, color: "#6b7693", marginTop: 8, lineHeight: 1.55 }}>
              Don't panic — register as soon as possible. Bring your earliest appointment screenshot. Fines are rarely enforced when you show you tried.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
