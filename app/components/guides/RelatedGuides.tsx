import Link from "next/link";
import { GUIDES } from "./guides-data";

type Props = {
  excludeId: string;
};

export function RelatedGuides({ excludeId }: Props) {
  const others = GUIDES.filter(g => g.id !== excludeId).slice(0, 6);

  return (
    <section style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #e2e8f0" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
        Related Guides
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {others.map(g => (
          <Link
            key={g.id}
            href={g.href}
            style={{
              display: "block",
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              textDecoration: "none",
            }}
          >
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#0075FF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
              {g.num ? `Guide ${g.num}` : "Guide"}
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>
              {g.ttl}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.2rem" }}>
              {g.sub}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
