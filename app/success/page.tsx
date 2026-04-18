// @ts-nocheck
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "expatflow-v1";
const INK = "#111111";
const BLUE = "#0075FF";
const GREEN = "#22c55e";
const MUTE = "#64748b";
const LIGHT = "#f8fafc";
const BORDER = "#e8ecf4";

function SuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("verifying");
  const [formData, setFormData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!sessionId) { router.replace("/"); return; }
    fetch("/api/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.paid) { router.replace("/"); return; }
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const saved = raw ? JSON.parse(raw) : null;
          setFormData(saved?.form ?? null);
        } catch { setFormData(null); }
        setStatus("ready");
      })
      .catch(() => router.replace("/"));
  }, [sessionId, router]);

  useEffect(() => {
    const onPop = () => router.replace("/");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [router]);

  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      localStorage.setItem("expatflow-paid", "1");
      setDone(true);
    } catch (e) { console.error(e); }
    setGenerating(false);
  }, []);

  const wipeAndFinish = useCallback(() => {
    try { localStorage.clear(); } catch {}
    router.replace("/");
  }, [router]);

  if (status === "verifying") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: LIGHT }}>
        <div style={{ textAlign: "center" }}>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ width: 28, height: 28, border: `3px solid ${BORDER}`, borderTopColor: BLUE, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: MUTE, fontSize: 14 }}>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: LIGHT, fontFamily: "system-ui,Arial,sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.card{animation:fadeUp 0.4s ease both}`}</style>

      <div style={{ background: "white", borderBottom: `1px solid ${BORDER}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 800, color: INK, fontSize: 14 }}>ExpatFlow <span style={{ color: BLUE }}>Berlin</span></span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />
          <span style={{ fontSize: 12, color: MUTE }}>Payment confirmed</span>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 16px 80px" }}>

        <div className="card" style={{ background: "white", borderRadius: 20, border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: 14 }}>
          <div style={{ background: `linear-gradient(135deg,#0f172a,${BLUE})`, padding: "28px 24px", textAlign: "center" }}>
            <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 16px" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle cx="40" cy="40" r="33" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" strokeDasharray="207.3" strokeDashoffset="0" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>100%</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>Prepared</span>
              </div>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: 6 }}>
              {formData?.people?.[0]?.firstName ? `${formData.people[0].firstName}, you are ready.` : "You are ready for the Burgeramt."}
            </h1>
            <p style={{ color: "rgba(191,219,254,0.85)", fontSize: 13 }}>Payment confirmed. Generate your documents below.</p>
          </div>

          <div style={{ padding: "22px 24px" }}>
            {!done ? (
              <button onClick={generate} disabled={generating}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px", borderRadius: 14, background: generating ? "#94a3b8" : `linear-gradient(135deg,#14532d,${GREEN})`, color: "white", fontWeight: 900, fontSize: 15, border: "none", cursor: "pointer" }}>
                {generating ? "Generating..." : "Generate & Download My Documents"}
              </button>
            ) : (
              <div>
                <div style={{ padding: "12px 16px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #86efac", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: "#15803d", fontSize: 13 }}>Documents ready — check your Downloads folder.</div>
                </div>
                <p style={{ color: MUTE, fontSize: 12, textAlign: "center" }}>
                  If nothing downloaded, <button onClick={() => router.replace("/")} style={{ background: "none", border: "none", color: BLUE, fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 0 }}>go back to homepage</button> to download from there.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ background: "#f0fdf4", borderRadius: 14, border: "1px solid #86efac", padding: "14px 16px", marginBottom: 14, animationDelay: "0.05s" }}>
          <div style={{ fontWeight: 700, color: "#15803d", fontSize: 12.5, marginBottom: 3 }}>Zero-Storage Policy</div>
          <p style={{ color: "#166534", fontSize: 12, lineHeight: 1.6 }}>Your data is only in your browser. We never received your address, passport, or family details. Once you wipe or clear your cache it is gone permanently.</p>
        </div>

        <div className="card" style={{ background: "white", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "18px 20px", marginBottom: 14, animationDelay: "0.1s" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTE, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 14 }}>Your next 3 steps</div>
          {[
            { n: "1", title: "Print your Anmeldung", body: "DM or Rossmann have self-service kiosks — approx 0.10 euro per page." },
            { n: "2", title: "Book your Burgeramt appointment", body: "service.berlin.de — any of 44 Berlin locations. Tuesday 8 AM new slots appear." },
            { n: "3", title: "Bring your checklist items", body: "Open your Checklist PDF. Every document personalised for your situation." },
          ].map(({ n, title, body }) => (
            <div key={n} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: "#eff6ff", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, fontSize: 11, color: BLUE }}>{n}</div>
              <div>
                <div style={{ fontWeight: 700, color: INK, fontSize: 13 }}>{title}</div>
                <div style={{ color: MUTE, fontSize: 12, marginTop: 2 }}>{body}</div>
              </div>
            </div>
          ))}
          <a href="https://service.berlin.de/dienstleistung/120686/" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px", borderRadius: 12, background: `linear-gradient(135deg,#0f172a,${BLUE})`, color: "white", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
            Book Burgeramt Appointment
          </a>
        </div>

        <div className="card" style={{ animationDelay: "0.15s" }}>
          <button onClick={wipeAndFinish}
            style={{ width: "100%", padding: "14px", borderRadius: 12, background: "transparent", border: `1.5px solid ${BORDER}`, color: MUTE, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Finish and Wipe My Data
          </button>
          <p style={{ textAlign: "center", color: MUTE, fontSize: 11, marginTop: 8 }}>Permanently clears all registration data from your browser.</p>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b" }}>Loading...</p>
      </div>
    }>
      <SuccessInner />
    </Suspense>
  );
}
