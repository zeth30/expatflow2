export type GuideEntry = {
  id: string;
  num: string;
  href: string;
  ttl: string;
  sub: string;
  cluster?: boolean;
};

export const GUIDES: GuideEntry[] = [
  { id: "anmeldung",  num: "00", href: "/anmeldung-berlin-guide",        ttl: "Anmeldung Berlin Guide",      sub: "Complete overview · start here" },
  { id: "whatisit",  num: "01", href: "/what-is-anmeldung",              ttl: "What is Anmeldung",            sub: "Start here · the basics" },
  { id: "noneu",     num: "02", href: "/anmeldung-online-non-eu",        ttl: "Online Anmeldung",             sub: "Why non-EU is excluded" },
  { id: "checklist", num: "03", href: "/anmeldung-documents",            ttl: "Document Checklist",           sub: "What to bring · what fails" },
  { id: "wgb",       num: "04", href: "/wohnungsgeberbestaetigung",      ttl: "Landlord Confirmation",        sub: "Wohnungsgeberbestätigung" },
  { id: "termin",    num: "05", href: "/burgeramt-berlin-appointment",   ttl: "Bürgeramt Appointment",        sub: "2026 booking guide · hacks" },
  // Cluster pages — appear in RelatedGuides, not numbered sidebar
  { id: "english",   num: "",   href: "/anmeldung-berlin-english",       ttl: "Anmeldung Form in English",    sub: "All 54 fields explained",       cluster: true },
  { id: "mistakes",  num: "",   href: "/anmeldung-mistakes-berlin",      ttl: "Common Mistakes",              sub: "Errors that get you sent home",  cluster: true },
  { id: "deadline",  num: "",   href: "/anmeldung-deadline-berlin",      ttl: "14-Day Deadline",              sub: "What happens if you're late",    cluster: true },
  { id: "couple",    num: "",   href: "/anmeldung-couple-berlin",        ttl: "Couples & Families",           sub: "Registering together",           cluster: true },
  { id: "moving",    num: "",   href: "/moving-to-berlin-registration",  ttl: "Moving to Berlin",             sub: "Registration for new arrivals",  cluster: true },
];

// Guides shown in the numbered sidebar (non-cluster only)
export const SIDEBAR_GUIDES = GUIDES.filter(g => !g.cluster);
