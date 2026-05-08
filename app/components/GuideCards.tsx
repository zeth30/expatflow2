const GUIDES = [
  {
    slug: "what-is-anmeldung",
    href: "/what-is-anmeldung",
    title: "What is the Anmeldung?",
    desc: "The legal basis, what it gets you, and what happens after registration.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    slug: "anmeldung-online-non-eu",
    href: "/anmeldung-online-non-eu",
    title: "Online Registration — Non-EU",
    desc: "Why non-EU citizens cannot register online and exactly what to do instead.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    slug: "anmeldung-documents",
    href: "/anmeldung-documents",
    title: "Documents Checklist",
    desc: "Every document you need at your Bürgeramt appointment, by situation.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    slug: "wohnungsgeberbestaetigung",
    href: "/wohnungsgeberbestaetigung",
    title: "Wohnungsgeberbestätigung",
    desc: "How to get your landlord to sign — and what to do if they refuse.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    slug: "burgeramt-berlin-appointment",
    href: "/burgeramt-berlin-appointment",
    title: "Bürgeramt Appointment Guide",
    desc: "How to find a slot, which districts have availability, and what to do at the counter.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];

export function GuideCards({ currentPage }: { currentPage?: string }) {
  const cards = GUIDES.filter(g => g.slug !== currentPage);
  return (
    <div style={{ marginBottom: 52 }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 18, letterSpacing: "-0.02em" }}>More guides</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {cards.map(g => (
          <a
            key={g.slug}
            href={g.href}
            style={{ display: "flex", flexDirection: "column", gap: 10, padding: "18px 18px 16px", borderRadius: 16, border: "1.5px solid #bfdbfe", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", textDecoration: "none", transition: "box-shadow 0.15s" }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#0075FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {g.icon}
            </div>
            <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 13.5, lineHeight: 1.3 }}>{g.title}</div>
            <div style={{ fontSize: 12.5, color: "#1d4ed8", lineHeight: 1.5, flexGrow: 1 }}>{g.desc}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#0075FF", marginTop: 2 }}>
              Read guide
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="#0075FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
