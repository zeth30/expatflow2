"use client";
import { useState, useEffect } from "react";

// ─── Modal shell ──────────────────────────────────────────────────
function LegalModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.6)", backdropFilter: "blur(6px)", zIndex: 500, overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px 80px" }}>
      <div style={{ maxWidth: 680, width: "100%", background: "white", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, background: "white", zIndex: 10 }}>
          <div style={{ fontWeight: 800, color: "#111111", fontSize: 16, letterSpacing: "-0.01em" }}>{title}</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "2px solid #e8ecf4", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: "inherit", color: "#64748b", fontSize: 16, fontWeight: 700 }}>×</button>
        </div>
        <div style={{ padding: "28px", color: "#374151", fontSize: 13.5, lineHeight: 1.75 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Typography helpers ───────────────────────────────────────────
const LH2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 14, fontWeight: 800, color: "#111111", marginTop: 24, marginBottom: 8, letterSpacing: "-0.01em" }}>{children}</h2>
);
const LP = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginBottom: 12, lineHeight: 1.75 }}>{children}</p>
);
const LUL = ({ items }: { items: string[] }) => (
  <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
    {items.map((item, i) => <li key={i} style={{ marginBottom: 5 }}>{item}</li>)}
  </ul>
);
const LHighlight = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: "12px 16px", borderRadius: 10, background: "#fff5f5", border: "1px solid #fecaca", marginBottom: 16 }}>
    <p style={{ color: "#991b1b", fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>{children}</p>
  </div>
);

// ─── Impressum ────────────────────────────────────────────────────
export function Impressum({ onClose }: { onClose: () => void }) {
  return (
    <LegalModal title="Impressum" onClose={onClose}>
      <LH2>Angaben gemäß §5 TMG</LH2>
      <LP>
        Karl Fasselt<br/>
        Fürbringerstraße 25<br/>
        10961 Berlin<br/>
        Germany
      </LP>
      <LH2>Kontakt</LH2>
      <LP>E-Mail: info@simplyexpat.de</LP>
      <LH2>Verantwortlich für den Inhalt nach §18 Abs. 2 MStV</LH2>
      <LP>
        Karl Fasselt<br/>
        Fürbringerstraße 25<br/>
        10961 Berlin
      </LP>
      <LH2>Haftungsausschluss</LH2>
      <LP>SimplyExpat ist ein technisches Hilfsmittel (Ausfüllhilfe) gemäß §2 RDG und stellt keine Rechtsberatung dar. Die generierten Dokumente ersetzen keine rechtliche Beratung. Die Richtigkeit der eingegebenen Daten liegt in der alleinigen Verantwortung des Nutzers.</LP>
      <LH2>Streitschlichtung</LH2>
      <LP>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <strong>ec.europa.eu/consumers/odr</strong>. Wir sind nicht bereit und nicht verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</LP>
    </LegalModal>
  );
}

// ─── Terms of Service ─────────────────────────────────────────────
export function TermsOfService({ onClose }: { onClose: () => void }) {
  return (
    <LegalModal title="Terms of Service — SimplyExpat" onClose={onClose}>
      <p style={{ color: "#64748b", fontSize: 12.5, marginBottom: 20 }}>Effective date: 1 April 2026 · SimplyExpat GmbH (in formation), Berlin, Germany</p>
      <LHighlight>
        SimplyExpat is a <strong>Technical Filing Aid (Ausfüllhilfe)</strong>. We are a software service, not a law firm, legal advisor, or governmental authority. Use of this service does not constitute legal advice and does not create a legal service relationship under §2 RDG (Rechtsdienstleistungsgesetz).
      </LHighlight>
      <LH2>1. Service Description</LH2>
      <LP>SimplyExpat provides a guided digital form-completion service that generates pre-filled PDF documents for the Berlin Anmeldung process (residential registration under §17 BMG). The service is strictly a technical tool. You remain solely responsible for the accuracy of the information you provide and for submitting completed documents to the relevant authority (Bürgeramt).</LP>
      <LH2>2. What We Do Not Do</LH2>
      <LUL items={[
        "We do not submit any registration on your behalf.",
        "We do not book Bürgeramt appointments. Appointment availability is managed exclusively by the Berlin city administration via service.berlin.de.",
        "We do not guarantee that your registration will be accepted by the Bürgeramt. Acceptance depends on your personal circumstances and the discretion of the authority.",
        "We do not provide legal, immigration, or tax advice.",
      ]} />
      <LH2>3. Eligibility</LH2>
      <LP>The service is available only for registrations at a <strong>Berlin address</strong>. By using SimplyExpat you confirm that your new primary address is located within the city boundaries of Berlin, Germany. Use for other cities or regions is not supported and may produce incorrect outputs.</LP>
      <LH2>4. Accuracy of Information</LH2>
      <LP>You warrant that all information you enter is truthful, accurate, and matches your official identity documents. Deliberately providing false information on an Anmeldung constitutes an administrative offence (Ordnungswidrigkeit) under German law. SimplyExpat bears no liability for errors arising from incorrect user inputs.</LP>
      <LH2>5. Payment and Delivery</LH2>
      <LP>The service fee is <strong>€15 (one-time, no subscription)</strong>. Payment is processed by Stripe via a secure hosted checkout page. SimplyExpat never handles your card details. Upon successful payment confirmation, you are redirected to a success page where PDF documents are generated instantly in your browser. Delivery is considered complete at the moment the PDF generation process finishes in your browser. No physical documents are sent.</LP>
      <LH2>6. Limitation of Liability</LH2>
      <LP>To the maximum extent permitted by applicable law, SimplyExpat's total liability to you for any claim arising from or relating to these Terms or the service shall not exceed the amount you paid for the service (€15). We are not liable for indirect, incidental, or consequential damages, including any administrative fees, fines, or costs arising from a rejected Anmeldung.</LP>
      <LH2>7. Governing Law</LH2>
      <LP>These Terms are governed by the laws of the Federal Republic of Germany. The exclusive place of jurisdiction for all disputes is Berlin, Germany, to the extent permitted by applicable consumer protection law.</LP>
      <LH2>8. Changes to Terms</LH2>
      <LP>We may update these Terms from time to time. Material changes will be communicated via the website. Continued use of the service after changes constitutes acceptance.</LP>
      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 24 }}>Contact: info@simplyexpat.de</p>
    </LegalModal>
  );
}

// ─── Cancellation Policy ──────────────────────────────────────────
export function CancellationPolicy({ onClose }: { onClose: () => void }) {
  return (
    <LegalModal title="Cancellation Policy (Widerrufsbelehrung)" onClose={onClose}>
      <p style={{ color: "#64748b", fontSize: 12.5, marginBottom: 20 }}>Effective date: 1 April 2026 · SimplyExpat GmbH (in formation)</p>
      <LHighlight>
        <strong>Important notice:</strong> Because SimplyExpat is a digital service that is performed immediately upon your request, your statutory right of withdrawal expires as soon as the PDF generation is complete — provided you have expressly consented to this at checkout, as required by §356 para. 5 BGB and Article 16(m) of Directive 2011/83/EU.
      </LHighlight>
      <LH2>Right of Withdrawal</LH2>
      <LP>You have the right to withdraw from this contract within <strong>14 days</strong> without giving any reason (§355 BGB). The withdrawal period begins on the day the contract is concluded (i.e., the moment payment is confirmed).</LP>
      <LP>To exercise your right of withdrawal, you must inform us of your decision by an unequivocal statement (e.g., by email to info@simplyexpat.de) before the service has been fully performed.</LP>
      <LH2>Expiry of the Right of Withdrawal for Digital Services</LH2>
      <LP><strong>You expressly acknowledge and agree</strong> that SimplyExpat will begin performing the service (PDF generation) immediately after your payment is confirmed, and that the service is fully performed at the moment PDF generation completes. By requesting immediate performance and confirming this at the point of payment, <strong>you waive your right of withdrawal</strong> under §356 para. 5 BGB once the service has been fully performed.</LP>
      <LP>This waiver is legally valid under §356 para. 5 BGB and Article 16(m) of EU Directive 2011/83/EU, which exempts fully-performed digital content services from the right of withdrawal where the consumer has given prior express consent and acknowledged the loss of the withdrawal right.</LP>
      <LH2>Consequence of Withdrawal (Before Service Completion)</LH2>
      <LP>If you exercise your right of withdrawal before PDF generation has started, we will reimburse all payments received from you, without undue delay and no later than 14 days after the day on which we receive your withdrawal decision. We will use the same means of payment as you used for the initial transaction.</LP>
      <LH2>Withdrawal Form (Model)</LH2>
      <LP>If you wish to withdraw, you may use the following model form (not mandatory):</LP>
      <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e8ecf4", fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.7, marginBottom: 16 }}>
        To: SimplyExpat GmbH, info@simplyexpat.de<br/>
        I/We hereby give notice that I/we withdraw from my/our contract for the provision of the following service: SimplyExpat Anmeldung PDF Generation<br/>
        Ordered on: ___________<br/>
        Name: ___________<br/>
        Signature (if paper): ___________<br/>
        Date: ___________
      </div>
      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 24 }}>Contact: info@simplyexpat.de</p>
    </LegalModal>
  );
}

// ─── Privacy Policy ───────────────────────────────────────────────
export function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  return (
    <LegalModal title="Privacy Policy — SimplyExpat" onClose={onClose}>
      <p style={{ color: "#64748b", fontSize: 12.5, marginBottom: 20 }}>Effective date: 1 April 2026 · Last reviewed: April 2026 · Verantwortlicher: Karl Fasselt, Fürbringerstraße 25, 10961 Berlin</p>
      <LHighlight>
        <strong>In plain English:</strong> The form data you enter (address, passport details, family information) never leaves your device. It is stored only in your browser and deleted once your PDFs are generated. The only personal data that reaches our servers is: (1) your payment via Stripe, and (2) optionally your first name and email address if you choose to receive a post-purchase confirmation email with your next steps.
      </LHighlight>
      <LH2>1. Controller (Verantwortlicher)</LH2>
      <LP>Karl Fasselt, Fürbringerstraße 25, 10961 Berlin, Germany. E-Mail: info@simplyexpat.de. Operating under the brand name SimplyExpat (GmbH in formation).</LP>
      <LH2>2. What data we process and why</LH2>
      <LP><strong>a) Registration form data</strong> — names, dates of birth, addresses, passport numbers, citizenship, marital status, religious affiliation: Stored exclusively in your browser's localStorage on your own device under the key "simplyexpat-v1". SimplyExpat has no technical access to this data at any point. It is never transmitted to our servers. It is automatically deleted from your browser once document generation is complete. Legal basis: this is not a processing activity by SimplyExpat within the meaning of Art. 4 No. 2 GDPR, as the data never reaches our systems (see GDPR Recital 26).</LP>
      <LP><strong>b) PDF generation</strong>: Your completed Anmeldung form and personalised checklist are generated entirely in your browser using the open-source pdf-lib library. The PDF bytes exist only in browser memory and are downloaded directly to your device. They are never transmitted to SimplyExpat servers.</LP>
      <LP><strong>c) Payment processing</strong>: Your payment of €15 is handled exclusively by Stripe, Inc. (510 Townsend Street, San Francisco, CA 94103, USA), a PCI-DSS Level 1 certified payment processor. You are redirected to a Stripe-hosted payment page. SimplyExpat never receives or processes your card number, bank details, or any payment credentials. After your payment is completed, your browser transmits only your Stripe session ID to our server for the sole purpose of confirming payment status (paid / not paid). No personal form data is included in this request. Legal basis: Art. 6(1)(b) GDPR — performance of a contract. Stripe's Privacy Policy: stripe.com/privacy.</LP>
      <LP><strong>d) Post-purchase next-steps email (optional)</strong>: After your documents are generated, you may optionally provide your email address to receive a transactional confirmation email. This email contains your next steps: printing your form, booking your Bürgeramt appointment, and your document checklist. The only data transmitted to our server and forwarded to our email service provider Resend, Inc. for delivery is: your email address, your first name, and the number of forms generated. No form data, no passport information, no special-category data (Art. 9 GDPR) is included. This field is entirely optional — the service is fully functional without providing an email. Legal basis: Art. 6(1)(a) GDPR — your freely given, specific, informed, and unambiguous consent by voluntarily entering your email address. You may withdraw this consent at any time by contacting info@simplyexpat.de; withdrawal does not affect the lawfulness of processing prior to withdrawal. Resend, Inc. Privacy Policy: resend.com/privacy.</LP>
      <LP><strong>e) Cookie / localStorage consent flag</strong>: When you acknowledge the cookie notice, a flag ("simplyexpat-cookie-ack-v1") is stored in your browser's localStorage. This flag contains no personal data and is used solely to avoid showing the notice repeatedly. Legal basis: §25(2) No. 2 TTDSG — strictly necessary.</LP>
      <LH2>3. Special category data — Religious affiliation (Art. 9 GDPR)</LH2>
      <LP>Religious affiliation is special-category personal data under Art. 9(1) GDPR. The Anmeldung form includes an optional field for religious affiliation for tax purposes (Kirchensteuer). Because all form data is processed exclusively in your browser and never transmitted to SimplyExpat servers, SimplyExpat does not process this data within the meaning of Art. 4 No. 2 GDPR. You may leave this field blank or select "None" — this is a valid choice that results in no church tax obligation.</LP>
      <LH2>4. Cookies and browser storage (§25 TTDSG)</LH2>
      <LP>We use no marketing, tracking, or analytics cookies. We use no third-party advertising cookies. The only storage mechanisms are:</LP>
      <LUL items={[
        "localStorage 'simplyexpat-v1': Your registration form state. Stored on your device only. Deleted automatically upon document generation. Legal basis: §25(2) No. 2 TTDSG — strictly necessary for the service you explicitly requested.",
        "localStorage 'simplyexpat-cookie-ack-v1': Records that you have acknowledged the cookie notice. Contains no personal data. Legal basis: §25(2) No. 2 TTDSG.",
        "Stripe cookies: Set by Stripe on their hosted checkout page to enable secure payment processing. Governed by Stripe's cookie policy. Legal basis: §25(2) No. 2 TTDSG — strictly necessary for payment.",
      ]} />
      <LH2>5. Data processors (Auftragsverarbeiter)</LH2>
      <LP>We use the following data processors who process personal data on our behalf under Art. 28 GDPR:</LP>
      <LUL items={[
        "Stripe, Inc., 510 Townsend Street, San Francisco, CA 94103, USA — payment processing. Data processed: payment session ID for verification. Basis: Art. 28 GDPR + Standard Contractual Clauses (SCCs).",
        "Resend, Inc. — transactional email delivery. Data processed: email address and first name, only when you voluntarily provide your email. Basis: Art. 28 GDPR + Standard Contractual Clauses (SCCs). Only used if you opt in to the confirmation email.",
      ]} />
      <LH2>6. International data transfers (Art. 44–49 GDPR)</LH2>
      <LP>Stripe and Resend are US-based companies. Data transfers to the USA are carried out on the basis of Standard Contractual Clauses (SCCs) pursuant to Art. 46(2)(c) GDPR, as adopted by the European Commission. You may request a copy of the applicable SCCs by contacting info@simplyexpat.de.</LP>
      <LH2>7. Your rights (Art. 15–22 GDPR)</LH2>
      <LP>You have the following rights regarding your personal data: the right of access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and the right to object (Art. 21). Because SimplyExpat does not store your form data on our servers, most of these rights apply to data held by Stripe (for payment records) or Resend (for email delivery, if you opted in). To exercise any right, contact info@simplyexpat.de. We will respond within 30 days.</LP>
      <LP>If you provided your email address and wish to withdraw consent for email processing, contact info@simplyexpat.de and we will instruct Resend to delete any data associated with your email. Withdrawal does not affect the lawfulness of processing carried out before withdrawal.</LP>
      <LP>You also have the right to lodge a complaint with a supervisory authority. The competent authority for SimplyExpat is: Berliner Beauftragte für Datenschutz und Informationsfreiheit, Friedrichstr. 219, 10969 Berlin, mailbox@datenschutz-berlin.de.</LP>
      <LH2>8. Data retention</LH2>
      <LP>SimplyExpat retains no personal data on its own systems. Browser localStorage data is deleted upon service completion. Stripe retains payment records for 7 years per §257 HGB (German Commercial Code). Resend retains email delivery data per their own retention policy; contact info@simplyexpat.de to request deletion.</LP>
      <LH2>9. Automated decision-making</LH2>
      <LP>SimplyExpat does not use automated decision-making or profiling within the meaning of Art. 22 GDPR.</LP>
      <LH2>10. Changes to this policy</LH2>
      <LP>We will notify you of material changes via the website at least 14 days before they take effect. The current version is always available at simplyexpat.de. The effective date is shown at the top of this document.</LP>
      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 24 }}>Datenschutzanfragen / GDPR enquiries: info@simplyexpat.de · Karl Fasselt, Fürbringerstraße 25, 10961 Berlin</p>
    </LegalModal>
  );
}

// ─── Legal footer — used in landing page AND wizard ───────────────
export function LandingLegalFooter() {
  const [modal, setModal] = useState<"tos" | "cancel" | "privacy" | "impressum" | null>(null);
  const linkStyle: React.CSSProperties = { background: "none", border: "none", color: "#64748b", fontSize: 12, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", padding: 0 };
  return (
    <>
      {modal === "tos"       && <TermsOfService     onClose={() => setModal(null)} />}
      {modal === "cancel"    && <CancellationPolicy onClose={() => setModal(null)} />}
      {modal === "privacy"   && <PrivacyPolicy      onClose={() => setModal(null)} />}
      {modal === "impressum" && <Impressum          onClose={() => setModal(null)} />}
      <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <button style={linkStyle} onClick={() => setModal("tos")}>Terms of Service</button>
        <span style={{ color: "#334155", fontSize: 12 }}>·</span>
        <button style={linkStyle} onClick={() => setModal("cancel")}>Cancellation Policy</button>
        <span style={{ color: "#334155", fontSize: 12 }}>·</span>
        <button style={linkStyle} onClick={() => setModal("privacy")}>Privacy Policy</button>
        <span style={{ color: "#334155", fontSize: 12 }}>·</span>
        <button style={linkStyle} onClick={() => setModal("impressum")}>Impressum</button>
      </div>
      <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 20, marginBottom: 10, lineHeight: 1.7, maxWidth: 680, textAlign: "center" }}>
        SimplyExpat helps expats complete the Berlin Anmeldung form in English and generate an official PDF ready for the Bürgeramt — with zero data stored on any server.
        Whether you need Anmeldung Berlin English PDF support, expert relocation Berlin paperwork assistance, or simply want to fill your Bürgeramt form without storing your data anywhere,
        SimplyExpat prepares everything in 5 minutes. Available for every nationality moving to Berlin.
      </p>
      <p style={{ color: "rgba(100,116,139,0.6)", fontSize: 11.5, marginTop: 14 }}>© 2026 SimplyExpat GmbH (in formation) · Berlin, Germany · Not a legal service (§2 RDG)</p>
    </>
  );
}

// ─── Cookie banner ────────────────────────────────────────────────
const COOKIE_KEY = "simplyexpat-cookie-ack-v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
    } catch { setVisible(true); }
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(COOKIE_KEY, "1"); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 400, background: "#111111", borderTop: "1px solid #1e293b", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{ color: "#94a3b8", fontSize: 12.5, lineHeight: 1.55 }}>
            <span style={{ color: "white", fontWeight: 600 }}>We do not store your information.</span>{" "}
            We use only essential cookies for secure payments and your registration progress — no tracking, no marketing, no third-party analytics.{" "}
            <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "#DD0000", fontSize: 12.5, cursor: "pointer", padding: 0, fontFamily: "inherit", textDecoration: "underline" }}>
              Privacy Policy
            </button>
          </p>
        </div>
        <button onClick={dismiss}
          style={{ padding: "8px 20px", borderRadius: 8, background: "white", color: "#111111", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, whiteSpace: "nowrap" }}>
          Understood
        </button>
      </div>
    </>
  );
}
