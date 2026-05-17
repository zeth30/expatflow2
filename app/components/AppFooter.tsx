"use client";
import { useState } from "react";
import { Impressum, TermsOfService, CancellationPolicy, PrivacyPolicy } from "./LegalModals";
import { JoinUsModal } from "./JoinUsModal";

export function AppFooter() {
  const [modal, setModal] = useState<"tos" | "cancel" | "privacy" | "impressum" | "joinus" | null>(null);
  return (
    <>
      <style>{`
        .af-link{background:none;border:none;color:#94a3b8;font-size:11.5px;cursor:pointer;font-family:inherit;text-decoration:underline;padding:0}
        .af-copy{color:#94a3b8;font-size:11.5px}
        @media(max-width:640px){
          .af-root{padding:14px 16px!important;gap:10px!important}
          .af-link{font-size:13px!important;padding:8px 4px!important}
          .af-copy{font-size:12px!important;text-align:center}
        }
      `}</style>
      <footer className="af-root" style={{ borderTop: "1px solid #e8ecf4", background: "#f8fafc", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap", flexShrink: 0 }}>
        {modal === "tos"       && <TermsOfService     onClose={() => setModal(null)} />}
        {modal === "cancel"    && <CancellationPolicy onClose={() => setModal(null)} />}
        {modal === "privacy"   && <PrivacyPolicy      onClose={() => setModal(null)} />}
        {modal === "impressum" && <Impressum          onClose={() => setModal(null)} />}
        {modal === "joinus"   && <JoinUsModal         onClose={() => setModal(null)} />}
        <span className="af-copy">© 2026 SimplyExpat · Not a legal service (§2 RDG)</span>
        <span style={{ color: "#cbd5e1" }} className="mob-hide">·</span>
        <button className="af-link" onClick={() => setModal("tos")}>Terms</button>
        <button className="af-link" onClick={() => setModal("cancel")}>Cancellation</button>
        <button className="af-link" onClick={() => setModal("privacy")}>Privacy</button>
        <button className="af-link" onClick={() => setModal("impressum")}>Impressum</button>
        <span style={{ color: "#cbd5e1" }} className="mob-hide">·</span>
        <button
          className="af-link"
          onClick={() => setModal("joinus")}
          style={{ color: "#cc0000", fontWeight: 700 }}
        >
          Join us
        </button>
      </footer>
    </>
  );
}
