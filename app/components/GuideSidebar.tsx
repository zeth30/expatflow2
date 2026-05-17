"use client";

const GUIDES = [
  { slug: "what-is-anmeldung", href: "/what-is-anmeldung", label: "What is the Anmeldung?" },
  { slug: "anmeldung-online-non-eu", href: "/anmeldung-online-non-eu", label: "Online Registration — Non-EU" },
  { slug: "anmeldung-documents", href: "/anmeldung-documents", label: "Documents Checklist" },
  { slug: "wohnungsgeberbestaetigung", href: "/wohnungsgeberbestaetigung", label: "Landlord Confirmation" },
  { slug: "burgeramt-berlin-appointment", href: "/burgeramt-berlin-appointment", label: "Bürgeramt Appointment Guide" },
];

export function GuideSidebar({ currentPage }: { currentPage: string }) {
  return (
    <aside className="guide-sidebar-el" style={{ width: 220, flexShrink: 0, position: "sticky", top: 72, alignSelf: "flex-start" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
        Anmeldung Guides
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {GUIDES.map(g => {
          const isCurrent = g.slug === currentPage;
          return isCurrent ? (
            <div key={g.slug} style={{ padding: "9px 12px", borderRadius: 9, background: "#fff5f5", border: "1.5px solid #fecaca", fontSize: 13, fontWeight: 700, color: "#DD0000", lineHeight: 1.4 }}>
              {g.label}
            </div>
          ) : (
            <a key={g.slug} href={g.href} style={{ display: "block", padding: "9px 12px", borderRadius: 9, fontSize: 13, fontWeight: 500, color: "#374151", textDecoration: "none", lineHeight: 1.4, transition: "background 0.12s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#f8fafc"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              {g.label}
            </a>
          );
        })}
      </div>
      <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 12, background: "#1a0505" }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: "white", marginBottom: 6, lineHeight: 1.3 }}>Ready to generate your form?</div>
        <p style={{ fontSize: 11.5, color: "rgba(191,219,254,0.8)", lineHeight: 1.6, margin: "0 0 12px" }}>Answer in English. Perfect German PDF in 5 minutes.</p>
        <a href="/#wizard/origin" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 14px", borderRadius: 9, background: "#DD0000", color: "white", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
          Get started
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </aside>
  );
}
