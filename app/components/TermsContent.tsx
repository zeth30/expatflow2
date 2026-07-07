// Shared Terms of Service content — used by both the modal (LegalModals.tsx)
// and the static /terms page. Edit here and both update automatically.

const s = {
  h2: { fontSize: 14, fontWeight: 800, color: "#111111", marginTop: 24, marginBottom: 8, letterSpacing: "-0.01em" } as React.CSSProperties,
  p:  { marginBottom: 12, lineHeight: 1.75 } as React.CSSProperties,
  ul: { paddingLeft: 18, marginBottom: 12 } as React.CSSProperties,
  li: { marginBottom: 5 } as React.CSSProperties,
  highlight: { padding: "12px 16px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: 16 } as React.CSSProperties,
  highlightText: { color: "#1e40af", fontSize: 13, lineHeight: 1.6, fontWeight: 500 } as React.CSSProperties,
};

export function TermsContent() {
  return (
    <>
      <div style={s.highlight}>
        <p style={s.highlightText}>
          ReadyExpat is a <strong>Technical Filing Aid (Ausfüllhilfe)</strong>. We are a software service, not a law firm, legal advisor, or governmental authority. Use of this service does not constitute legal advice and does not create a legal service relationship under §2 RDG (Rechtsdienstleistungsgesetz).
        </p>
      </div>

      <h2 style={s.h2}>1. Service Description</h2>
      <p style={s.p}>ReadyExpat provides a guided digital form-completion service that generates pre-filled PDF documents for the Berlin Anmeldung process (residential registration under §17 BMG). The service is strictly a technical tool. You remain solely responsible for the accuracy of the information you provide and for submitting completed documents to the relevant authority (Bürgeramt).</p>

      <h2 style={s.h2}>2. What We Do Not Do</h2>
      <ul style={s.ul}>
        <li style={s.li}>We do not submit any registration on your behalf.</li>
        <li style={s.li}>We do not book Bürgeramt appointments. Appointment availability is managed exclusively by the Berlin city administration via service.berlin.de.</li>
        <li style={s.li}>We do not guarantee that your registration will be accepted by the Bürgeramt. Acceptance depends on your personal circumstances and the discretion of the authority.</li>
        <li style={s.li}>We do not provide legal, immigration, or tax advice.</li>
      </ul>

      <h2 style={s.h2}>3. Eligibility</h2>
      <p style={s.p}>The service is available only for registrations at a <strong>Berlin address</strong>. By using ReadyExpat you confirm that your new primary address is located within the city boundaries of Berlin, Germany. Use for other cities or regions is not supported and may produce incorrect outputs.</p>

      <h2 style={s.h2}>4. Accuracy of Information</h2>
      <p style={s.p}>You warrant that all information you enter is truthful, accurate, and matches your official identity documents. Deliberately providing false information on an Anmeldung constitutes an administrative offence (Ordnungswidrigkeit) under German law. ReadyExpat bears no liability for errors arising from incorrect user inputs.</p>

      <h2 style={s.h2}>5. Payment and Delivery</h2>
      <p style={s.p}>The service fee is <strong>€15 (one-time, no subscription)</strong>. Gemäß §19 UStG wird keine Umsatzsteuer erhoben (Kleinunternehmerregelung). Payment is processed by Stripe via a secure hosted checkout page. ReadyExpat never handles your card details. Upon successful payment confirmation, you are redirected to a success page where PDF documents are generated instantly in your browser. Delivery is considered complete at the moment the PDF generation process finishes in your browser. No physical documents are sent.</p>

      <h2 style={s.h2}>6. Right of Withdrawal — Digital Services</h2>
      <p style={s.p}>You have the right to withdraw from this contract within <strong>14 days</strong> without giving any reason (§355 BGB). However, by requesting immediate service delivery and expressly consenting at the point of payment, you acknowledge that the service begins immediately after payment and that <strong>your right of withdrawal expires once PDF generation is complete</strong> (§356 Abs. 5 BGB; Art. 16(m) Directive 2011/83/EU). If you wish to withdraw before the service has started, contact info@readyexpat.de immediately.</p>

      <h2 style={s.h2}>7. Limitation of Liability</h2>
      <p style={s.p}>To the maximum extent permitted by applicable law, ReadyExpat's total liability to you for any claim arising from or relating to these Terms or the service shall not exceed the amount you paid for the service (€15). We are not liable for indirect, incidental, or consequential damages, including any administrative fees, fines, or costs arising from a rejected Anmeldung.</p>

      <h2 style={s.h2}>8. Tax Form Assistant (Easy Fragebogen zur steuerlichen Erfassung)</h2>
      <p style={s.p}>The tax form assistant translates and explains the fields of the official ELSTER questionnaire (&quot;Fragebogen zur steuerlichen Erfassung&quot;) in English and formats the answers you yourself provide. This constitutes mechanical assistance based on your individual instructions (§6 Nr. 3 StBerG). ReadyExpat is <strong>not a tax consultancy (Steuerberatung)</strong> within the meaning of the Steuerberatungsgesetz, is not admitted to provide tax advice, and does not provide individual tax advice, tax planning, or recommendations of any kind.</p>
      <p style={s.p}>All entries, estimates, and elections (including whether to apply the Kleinunternehmer-Regelung under §19 UStG) are made exclusively by you. You are responsible for reviewing your entries in ELSTER before submission. We do not submit the questionnaire on your behalf — submission happens exclusively in your own ELSTER account. For advice on your individual tax situation, consult a licensed Steuerberater or lawyer.</p>
      <p style={s.p}>All form data you enter into the tax form assistant is processed locally in your browser and stored only in your browser&apos;s localStorage. It is not transmitted to or stored on ReadyExpat&apos;s servers. Payment processing is handled by Stripe.</p>

      <h2 style={s.h2}>9. Governing Law</h2>
      <p style={s.p}>These Terms are governed by the laws of the Federal Republic of Germany. The exclusive place of jurisdiction for all disputes is Berlin, Germany, to the extent permitted by applicable consumer protection law.</p>

      <h2 style={s.h2}>10. Changes to Terms</h2>
      <p style={s.p}>We may update these Terms from time to time and will communicate material changes via the website. If you do not agree with updated Terms, please contact us at info@readyexpat.de before your next use.</p>

      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 24 }}>Contact: info@readyexpat.de · ReadyExpat, Berlin, Germany</p>
    </>
  );
}
