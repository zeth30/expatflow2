import type { Metadata } from "next";
import { TermsContent } from "../components/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service — SimplyExpat",
  description: "Terms of Service for SimplyExpat — the Berlin Anmeldung PDF preparation service.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <div style={{
      maxWidth: 720,
      margin: "0 auto",
      padding: "48px 24px 80px",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      color: "#374151",
      fontSize: 14,
      lineHeight: 1.75,
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4, letterSpacing: "-0.02em" }}>
        Terms of Service
      </h1>
      <p style={{ color: "#94a3b8", fontSize: 12.5, marginBottom: 32 }}>
        Effective date: 1 April 2026 · SimplyExpat, Berlin, Germany
      </p>
      <TermsContent />
    </div>
  );
}
