"use client";
import { useState } from "react";
import { Impressum, TermsOfService, CancellationPolicy, PrivacyPolicy } from "./LegalModals";

export function AppFooter() {
  const [modal, setModal] = useState<"tos" | "cancel" | "privacy" | "impressum" | null>(null);
  const link: React.CSSProperties = {
    background: "none", border: "none", color: "#94a3b8", fontSize: 11.5,
    cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", padding: 0,
  };
  return (
    <footer style={{ borderTop: "1px solid #e8ecf4", background: "#f8fafc", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap", flexShrink: 0 }}>
      {modal === "tos"       && <TermsOfService     onClose={() => setModal(null)} />}
      {modal === "cancel"    && <CancellationPolicy onClose={() => setModal(null)} />}
      {modal === "privacy"   && <PrivacyPolicy      onClose={() => setModal(null)} />}
      {modal === "impressum" && <Impressum          onClose={() => setModal(null)} />}
      <span style={{ color: "#94a3b8", fontSize: 11.5 }}>© 2026 SimplyExpat · Not a legal service (§2 RDG)</span>
      <span style={{ color: "#cbd5e1" }}>·</span>
      <button style={link} onClick={() => setModal("tos")}>Terms</button>
      <button style={link} onClick={() => setModal("cancel")}>Cancellation</button>
      <button style={link} onClick={() => setModal("privacy")}>Privacy</button>
      <button style={link} onClick={() => setModal("impressum")}>Impressum</button>
    </footer>
  );
}
