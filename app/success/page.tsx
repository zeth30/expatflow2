// @ts-nocheck
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BLUE = "#0075FF";
const MUTE = "#64748b";
const LIGHT = "#f8fafc";
const BORDER = "#e8ecf4";
const GREEN = "#22c55e";
const INK = "#111111";

function SuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("verifying");
  const [dots, setDots] = useState(".");

  // Animate dots while verifying
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!sessionId) { router.replace("/"); return; }

    fetch("/api/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.paid) {
          setStatus("error");
          return;
        }
        // Payment confirmed — redirect to main app which handles PDF generation
        // The ?paid=verified flag tells page.tsx to skip the payment screen
        // and auto-trigger doGenerate
        setStatus("confirmed");
        setTimeout(() => {
          router.replace("/?paid=verified");
        }, 1200);
      })
      .catch(() => setStatus("error"));
  }, [sessionId, router]);

  const retry = useCallback(() => router.replace("/"), [router]);

  return (
    <div style={{ minHeight: "100vh", background: LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,Arial,sans-serif", padding: "20px" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pop{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>

      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 40 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg,#0f172a,${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 14, fontWeight: 900 }}>E</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: INK }}>ExpatFlow <span style={{ color: BLUE }}>Berlin</span></span>
        </div>

        {status === "verifying" && (
          <div>
            <div style={{ width: 56, height: 56, border: `4px solid ${BORDER}`, borderTopColor: BLUE, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
            <div style={{ fontWeight: 800, color: INK, fontSize: 18, marginBottom: 8 }}>Confirming your payment{dots}</div>
            <p style={{ color: MUTE, fontSize: 14 }}>Please wait — this takes just a second.</p>
          </div>
        )}

        {status === "confirmed" && (
          <div style={{ animation: "pop 0.3s ease" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", border: `3px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ fontWeight: 800, color: INK, fontSize: 18, marginBottom: 8 }}>Payment confirmed!</div>
            <p style={{ color: MUTE, fontSize: 14 }}>Generating your documents now{dots}</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", border: "3px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <div style={{ fontWeight: 800, color: INK, fontSize: 18, marginBottom: 8 }}>Payment could not be verified</div>
            <p style={{ color: MUTE, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              If you were charged, please contact us at <strong>legal@expatflow.de</strong> with your payment confirmation and we will resolve it immediately.
            </p>
            <button onClick={retry}
              style={{ padding: "13px 28px", borderRadius: 12, background: INK, color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Back to homepage
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <p style={{ color: "#64748b", fontFamily: "system-ui,Arial,sans-serif" }}>Loading...</p>
      </div>
    }>
      <SuccessInner />
    </Suspense>
  );
}
