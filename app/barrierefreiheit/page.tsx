import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barrierefreiheitserklärung — SimplyExpat",
  description: "Erklärung zur Barrierefreiheit von SimplyExpat gemäß BFSG.",
  robots: { index: false, follow: false },
};

const s = {
  page: { maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#374151", fontSize: 14, lineHeight: 1.75 } as React.CSSProperties,
  h1: { fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4, letterSpacing: "-0.02em" } as React.CSSProperties,
  meta: { color: "#94a3b8", fontSize: 12.5, marginBottom: 32 } as React.CSSProperties,
  h2: { fontSize: 14, fontWeight: 800, color: "#111", marginTop: 28, marginBottom: 8 } as React.CSSProperties,
  p: { marginBottom: 12 } as React.CSSProperties,
  notice: { padding: "14px 18px", borderRadius: 10, background: "#fefce8", border: "1px solid #fde68a", marginBottom: 24, color: "#92400e", fontSize: 13, lineHeight: 1.6 } as React.CSSProperties,
  ul: { paddingLeft: 20, marginBottom: 12 } as React.CSSProperties,
  li: { marginBottom: 5 } as React.CSSProperties,
};

export default function BarrierefreiheitPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Erklärung zur Barrierefreiheit</h1>
      <p style={s.meta}>Stand: Mai 2026 · SimplyExpat, Berlin</p>

      <div style={s.notice}>
        <strong>Hinweis:</strong> SimplyExpat ist ein privates Digitalangebot und bemüht sich um Konformität mit dem Barrierefreiheitsstärkungsgesetz (BFSG) sowie den Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Diese Erklärung dokumentiert den aktuellen Stand und bekannte Einschränkungen.
      </div>

      <h2 style={s.h2}>Stand der Barrierefreiheit</h2>
      <p style={s.p}>SimplyExpat ist <strong>teilweise konform</strong> mit WCAG 2.1 Level AA. Die bekannten Einschränkungen sind nachfolgend aufgeführt.</p>

      <h2 style={s.h2}>Nicht barrierefreie Inhalte</h2>
      <p style={s.p}>Die folgenden Einschränkungen sind bekannt und werden schrittweise behoben:</p>
      <ul style={s.ul}>
        <li style={s.li}><strong>Formularfelder:</strong> Nicht alle Eingabefelder im Antragsassistenten verfügen über sichtbare HTML-Labels oder ARIA-Labels. Die Felder sind visuell beschriftet, aber programmatische Verknüpfungen werden verbessert.</li>
        <li style={s.li}><strong>Farbkontrast:</strong> Einzelne sekundäre Textelemente (Hinweistexte) werden auf ausreichenden Kontrast nach WCAG 1.4.3 (4.5:1) geprüft.</li>
        <li style={s.li}><strong>Tastaturnavigation:</strong> Der Assistent ist grundsätzlich per Tastatur bedienbar; einzelne interaktive Elemente werden auf vollständige Fokus-Sichtbarkeit optimiert.</li>
      </ul>

      <h2 style={s.h2}>Barrierefreie Elemente</h2>
      <ul style={s.ul}>
        <li style={s.li}>Skip-to-content-Link vorhanden (sichtbar bei Tastaturfokus)</li>
        <li style={s.li}>Schriftarten sind selbst gehostet (keine externe Ressourcen-Anfragen)</li>
        <li style={s.li}>Alle Bilder mit dekorativem Charakter tragen leere Alt-Attribute</li>
        <li style={s.li}>Sprachattribut <code>lang="en"</code> korrekt gesetzt</li>
        <li style={s.li}>Responsive Layout für alle Bildschirmgrößen</li>
      </ul>

      <h2 style={s.h2}>Feedback und Kontakt</h2>
      <p style={s.p}>
        Wenn Sie Barrieren auf dieser Website feststellen oder Hilfe benötigen, kontaktieren Sie uns bitte:
      </p>
      <p style={s.p}>
        <strong>E-Mail:</strong> <a href="mailto:info@simplyexpat.de" style={{ color: "#0075FF" }}>info@simplyexpat.de</a><br />
        <strong>Betreff:</strong> Barrierefreiheit
      </p>
      <p style={s.p}>Wir bemühen uns um eine Antwort innerhalb von 5 Werktagen.</p>

      <h2 style={s.h2}>Durchsetzungsverfahren</h2>
      <p style={s.p}>Wenn Sie auf eine Meldung keine zufriedenstellende Antwort erhalten haben, können Sie die zuständige Stelle kontaktieren:</p>
      <p style={s.p}>
        Berliner Beauftragte für Datenschutz und Informationsfreiheit<br />
        Friedrichstr. 219, 10969 Berlin<br />
        <a href="mailto:mailbox@datenschutz-berlin.de" style={{ color: "#0075FF" }}>mailbox@datenschutz-berlin.de</a>
      </p>

      <h2 style={s.h2}>Erstellungsdatum dieser Erklärung</h2>
      <p style={s.p}>Diese Erklärung wurde am 17. Mai 2026 erstellt und wird regelmäßig aktualisiert.</p>

      <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 32 }}>
        SimplyExpat · Fürbringerstraße 25, 10961 Berlin · info@simplyexpat.de
      </p>
    </div>
  );
}
