import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SimplyExpat",
  description: "Terms of Service for SimplyExpat — the Berlin Anmeldung PDF preparation service.",
  robots: { index: false, follow: false },
};

const s = {
  page: { maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#374151", fontSize: 14, lineHeight: 1.75 } as React.CSSProperties,
  h1: { fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4, letterSpacing: "-0.02em" } as React.CSSProperties,
  meta: { color: "#94a3b8", fontSize: 12.5, marginBottom: 32 } as React.CSSProperties,
  h2: { fontSize: 14, fontWeight: 800, color: "#111", marginTop: 28, marginBottom: 8 } as React.CSSProperties,
  p: { marginBottom: 12 } as React.CSSProperties,
  highlight: { padding: "12px 16px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: 20, color: "#1e40af", fontSize: 13, fontWeight: 500, lineHeight: 1.6 } as React.CSSProperties,
  ul: { paddingLeft: 20, marginBottom: 12 } as React.CSSProperties,
  li: { marginBottom: 5 } as React.CSSProperties,
};

export default function TermsPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Terms of Service</h1>
      <p style={s.meta}>Effective date: 1 April 2026 · SimplyExpat, Berlin, Germany</p>

      <div style={s.highlight}>
        SimplyExpat is a <strong>Technical Filing Aid (Ausfüllhilfe)</strong>. We are a software service, not a law firm, legal advisor, or governmental authority. Use of this service does not constitute legal advice and does not create a legal service relationship under §2 RDG (Rechtsdienstleistungsgesetz).
      </div>

      <h2 style={s.h2}>1. Service Description</h2>
      <p style={s.p}>SimplyExpat provides a guided digital form-completion service that generates pre-filled PDF documents for the Berlin Anmeldung process (residential registration under §17 BMG). The service is strictly a technical tool. You remain solely responsible for the accuracy of the information you provide and for submitting completed documents to the relevant authority (Bürgeramt).</p>

      <h2 style={s.h2}>2. What We Do Not Do</h2>
      <ul style={s.ul}>
        <li style={s.li}>We do not submit any registration on your behalf.</li>
        <li style={s.li}>We do not book Bürgeramt appointments. Appointment availability is managed exclusively by the Berlin city administration via service.berlin.de.</li>
        <li style={s.li}>We do not guarantee that your registration will be accepted by the Bürgeramt. Acceptance depends on your personal circumstances and the discretion of the authority.</li>
        <li style={s.li}>We do not provide legal, immigration, or tax advice.</li>
      </ul>

      <h2 style={s.h2}>3. Eligibility</h2>
      <p style={s.p}>The service is available only for registrations at a <strong>Berlin address</strong>. By using SimplyExpat you confirm that your new primary address is located within the city boundaries of Berlin, Germany. Use for other cities or regions is not supported and may produce incorrect outputs.</p>

      <h2 style={s.h2}>4. Accuracy of Information</h2>
      <p style={s.p}>You warrant that all information you enter is truthful, accurate, and matches your official identity documents. Deliberately providing false information on an Anmeldung constitutes an administrative offence (Ordnungswidrigkeit) under German law. SimplyExpat bears no liability for errors arising from incorrect user inputs.</p>

      <h2 style={s.h2}>5. Payment and Delivery</h2>
      <p style={s.p}>The service fee is <strong>€15 (one-time, no subscription)</strong>. Gemäß §19 UStG wird keine Umsatzsteuer erhoben (Kleinunternehmerregelung). Payment is processed by Stripe via a secure hosted checkout page. SimplyExpat never handles your card details. Upon successful payment confirmation, you are redirected to a success page where PDF documents are generated instantly in your browser. Delivery is considered complete at the moment the PDF generation process finishes in your browser. No physical documents are sent.</p>

      <h2 style={s.h2}>6. Right of Withdrawal — Digital Services</h2>
      <p style={s.p}>You have the right to withdraw from this contract within <strong>14 days</strong> without giving any reason (§355 BGB). However, by requesting immediate service delivery and expressly consenting at the point of payment, you acknowledge that the service begins immediately after payment and that <strong>your right of withdrawal expires once PDF generation is complete</strong> (§356 Abs. 5 BGB; Art. 16(m) Directive 2011/83/EU). If you wish to withdraw before the service has started, contact info@simplyexpat.de immediately.</p>

      <h2 style={s.h2}>7. Limitation of Liability</h2>
      <p style={s.p}>To the maximum extent permitted by applicable law, SimplyExpat's total liability to you for any claim arising from or relating to these Terms or the service shall not exceed the amount you paid for the service (€15). We are not liable for indirect, incidental, or consequential damages, including any administrative fees, fines, or costs arising from a rejected Anmeldung.</p>

      <h2 style={s.h2}>8. Governing Law</h2>
      <p style={s.p}>These Terms are governed by the laws of the Federal Republic of Germany. The exclusive place of jurisdiction for all disputes is Berlin, Germany, to the extent permitted by applicable consumer protection law.</p>

      <h2 style={s.h2}>9. Changes to Terms</h2>
      <p style={s.p}>We may update these Terms from time to time and will communicate material changes via the website. If you do not agree with updated Terms, please contact us at info@simplyexpat.de before your next use.</p>

      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 32 }}>
        Contact: info@simplyexpat.de · Karl Fasselt, Fürbringerstraße 25, 10961 Berlin
      </p>
    </div>
  );
}
