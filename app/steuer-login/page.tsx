import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false },
};

// Password form for the personal-use Steuer page (shown via proxy.ts rewrite).
export default async function SteuerLogin({ searchParams }: { searchParams: Promise<{ wrong?: string }> }) {
  const { wrong } = await searchParams;
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)", padding: 20 }}>
      <form method="POST" action="/api/steuer-login" style={{ width: "100%", maxWidth: 360, background: "white", borderRadius: 16, padding: "28px 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#0f172a,#0075FF)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <span style={{ color: "white", fontSize: 15, fontWeight: 900 }}>R</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>Private page</h1>
        <p style={{ color: "#64748b", fontSize: 13.5, marginBottom: 18 }}>Enter the password to continue.</p>
        <input type="password" name="password" autoFocus required placeholder="Password" autoComplete="current-password"
          style={{ width: "100%", padding: "12px 13px", borderRadius: 10, border: `1.5px solid ${wrong ? "#f87171" : "#e2e8f0"}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 }} />
        {wrong && <p style={{ color: "#dc2626", fontSize: 12.5, marginBottom: 10 }}>Wrong password — try again.</p>}
        <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0075FF,#2563eb)", color: "white", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
          Unlock
        </button>
      </form>
    </div>
  );
}
