"use client";
import { useState } from "react";

export function JoinUsModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <style>{`
        .ju-backdrop{position:fixed;inset:0;background:rgba(10,22,56,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
        .ju-card{background:white;border-radius:24px;padding:36px 32px;max-width:420px;width:100%;box-shadow:0 24px 60px rgba(10,22,56,.18);position:relative}
        .ju-close{position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;color:#94a3b8;padding:6px;border-radius:8px;display:grid;place-items:center}
        .ju-close:hover{background:#f1f5f9;color:#0f172a}
        .ju-input{width:100%;padding:13px 16px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:15px;font-family:inherit;outline:none;transition:border-color .15s;box-sizing:border-box}
        .ju-input:focus{border-color:#0040ff}
        .ju-btn{width:100%;padding:14px;background:#0f172a;color:white;border:none;border-radius:11px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;transition:background .15s;margin-top:10px}
        .ju-btn:hover:not(:disabled){background:#0040ff}
        .ju-btn:disabled{opacity:.6;cursor:default}
        .ju-err{color:#e11d48;font-size:13px;margin-top:8px}
      `}</style>

      <div className="ju-backdrop" onClick={onClose}>
        <div className="ju-card" onClick={e => e.stopPropagation()}>
          <button className="ju-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {status === "done" ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#ecfdf3", border: "1px solid #c7f0d3", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>You&apos;re in.</div>
              <div style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.55 }}>We&apos;ll let you know when we ship new guides and features.</div>
              <button className="ju-btn" style={{ marginTop: 24 }} onClick={onClose}>Done</button>
            </div>
          ) : (
            <>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#0f172a,#0040ff)", display: "grid", placeItems: "center", marginBottom: 18 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>Stay in the loop</div>
              <div style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.55, marginBottom: 22 }}>
                New guides, features, and Berlin expat tips — no spam, unsubscribe any time.
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  className="ju-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                {status === "error" && <div className="ju-err">{errorMsg}</div>}
                <button className="ju-btn" type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Subscribing…" : "Subscribe →"}
                </button>
              </form>

              <div style={{ fontSize: 11.5, color: "#94a3b8", textAlign: "center", marginTop: 14 }}>
                No spam. Unsubscribe any time.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
