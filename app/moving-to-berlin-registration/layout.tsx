import "../guides.css";
import { SharedNav } from "../components/SharedNav";
import { AppFooter } from "../components/AppFooter";

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <SharedNav />
      </div>
      {children}
      <div style={{ marginLeft: "var(--sb-w)" }}>
        <AppFooter />
      </div>
    </>
  );
}
