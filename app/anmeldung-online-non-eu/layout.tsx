import "../guides.css";
import { SharedNav } from "../components/SharedNav";
import { AppFooter } from "../components/AppFooter";

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SharedNav />
      {children}
      <div style={{ marginLeft: "var(--sb-w)" }}>
        <AppFooter />
      </div>
    </>
  );
}
